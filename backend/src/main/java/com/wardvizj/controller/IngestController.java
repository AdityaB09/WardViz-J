package com.wardvizj.controller;

import com.wardvizj.model.Event;
import com.wardvizj.model.Note;
import com.wardvizj.repo.NoteRepository;
import com.wardvizj.service.EventNormalizerService;
import com.wardvizj.service.MedicalNerService;
import com.wardvizj.service.NlpIngestService;
import com.wardvizj.service.TimelineEngine;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class IngestController {

    private final NlpIngestService nlp;
    private final MedicalNerService ner;
    private final EventNormalizerService norm;
    private final TimelineEngine timeline;
    private final NoteRepository noteRepo;

    @PostMapping("/ingest")
    public Map<String, Object> ingest(@RequestBody IngestReq req) {
        var s = nlp.preprocess(req.text);
        Note note = Note.builder()
                .id(UUID.randomUUID())
                .patientId(req.patientId)
                .ts(Optional.ofNullable(req.ts).orElse(s.guessedTs()))
                .text(req.text)
                .sections(toJson(s.sections()))
                .build();
        note = noteRepo.save(note);

        List<Event> evs = new ArrayList<>();
        var mentions = ner.extract(req.text);
        for (var m : mentions) {
            var n = norm.normalize(m.label());
            String snippet = req.text.substring(m.start(), Math.min(req.text.length(), m.end()));
            String spanJson = String.format(
                    "[{\"start\":%d,\"end\":%d,\"sentence\":\"%s\",\"weight\":%.2f}]",
                    m.start(),
                    m.end(),
                    escape(snippet),
                    m.prob()
            );

            Event e = Event.builder()
                    .id(UUID.randomUUID())
                    .patientId(req.patientId)
                    .type(m.type())
                    .code(n.code())
                    .label(n.label())
                    .startTs(note.getTs())
                    .confidence(m.prob())
                    .sourceNote(note)
                    .evidenceSpan(spanJson)
                    .build();
            evs.add(e);
        }
        List<Event> stitched = timeline.stitch(req.patientId, evs);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("noteId", note.getId());
        out.put("eventsCreated", stitched.size());
        out.put("patientId", req.patientId);
        return out;
    }

    private static String toJson(Map<String, String> m) {
        return m.entrySet().stream()
                .map(e -> "\"" + e.getKey() + "\":\"" + escape(e.getValue()) + "\"")
                .collect(Collectors.joining(",", "{", "}"));
    }

    private static String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @Data
    public static class IngestReq {
        @NotBlank
        public String patientId;
        @NotBlank
        public String text;
        public OffsetDateTime ts;
    }
}
