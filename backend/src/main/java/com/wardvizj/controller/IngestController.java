package com.wardvizj.controller;

import com.wardvizj.model.IngestResponse;
import com.wardvizj.model.Note;
import com.wardvizj.model.TimelineEventDto;
import com.wardvizj.repo.NoteRepository;
import com.wardvizj.service.TimelineEngine;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class IngestController {

    private final NoteRepository noteRepository;
    private final TimelineEngine timelineEngine;

    public IngestController(NoteRepository noteRepository,
                            TimelineEngine timelineEngine) {
        this.noteRepository = noteRepository;
        this.timelineEngine = timelineEngine;
    }

    public record IngestRequest(String patientId, String text) {
    }

    @PostMapping("/ingest")
    public IngestResponse ingest(@RequestBody IngestRequest request) {
        Note note = new Note();
        note.setId(UUID.randomUUID());
        note.setPatientId(request.patientId());
        note.setText(request.text());
        note.setSections("free-text");
        note.setTs(OffsetDateTime.now(ZoneOffset.UTC));

        Note saved = noteRepository.save(note);

        // Use the same rule engine to estimate how many events this note will generate
        List<TimelineEventDto> preview = timelineEngine.extractEventsFromNote(saved);

        return new IngestResponse(saved.getId(), saved.getPatientId(), preview.size());
    }
}
