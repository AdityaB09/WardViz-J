package com.wardvizj.service;

import com.wardvizj.model.EvidenceLinkDto;
import com.wardvizj.model.Note;
import com.wardvizj.model.TimelineEventDto;
import com.wardvizj.repo.NoteRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class TimelineEngine {

    private final NoteRepository noteRepository;

    public TimelineEngine(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    /**
     * Build a timeline for a patient purely from stored notes using simple text rules.
     */
    public List<TimelineEventDto> buildTimelineForPatient(String patientId) {
        List<Note> allNotes = noteRepository.findAll();
        List<TimelineEventDto> result = new ArrayList<>();

        allNotes.stream()
                .filter(n -> patientId.equals(n.getPatientId()))
                .sorted(Comparator.comparing(Note::getTs, Comparator.nullsLast(Comparator.naturalOrder())))
                .forEach(n -> result.addAll(extractEventsFromNote(n)));

        return result;
    }

    /**
     * Simple uncertainty scores so UI has something to render.
     */
    public Map<String, Double> estimateUncertainty(List<TimelineEventDto> events) {
        Map<String, Double> m = new LinkedHashMap<>();
        if (events.isEmpty()) {
            m.put("nlpConfidence", 0.0);
            m.put("temporalOrdering", 0.0);
        } else {
            m.put("nlpConfidence", 0.8);
            m.put("temporalOrdering", events.size() > 1 ? 0.2 : 0.0);
        }
        return m;
    }

    /**
     * Create simple temporal links between consecutive events.
     */
    public List<EvidenceLinkDto> buildLinks(List<TimelineEventDto> events) {
        List<EvidenceLinkDto> links = new ArrayList<>();
        for (int i = 1; i < events.size(); i++) {
            TimelineEventDto prev = events.get(i - 1);
            TimelineEventDto curr = events.get(i);
            links.add(new EvidenceLinkDto(
                    UUID.randomUUID().toString(),
                    prev.id(),
                    curr.id(),
                    "temporal"
            ));
        }
        return links;
    }

    /**
     * Extract events from a single note using simple keyword rules.
     * Different texts → different events.
     */
    public List<TimelineEventDto> extractEventsFromNote(Note note) {
        String patientId = note.getPatientId();
        String text = Optional.ofNullable(note.getText())
                .orElse("")
                .toLowerCase(Locale.ROOT);

        String ts = Optional.ofNullable(note.getTs())
                .map(Object::toString)
                .orElse(OffsetDateTime.now(ZoneOffset.UTC).toString());

        List<TimelineEventDto> events = new ArrayList<>();

        // Diagnosis: diabetes
        if (text.contains("type 2 diabetes") || text.contains("t2d") || text.contains("diabetes")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "Type 2 diabetes mellitus",
                    "diagnosis",
                    "Objective",
                    ts
            ));
        }

        // Diagnosis: hypertension
        if (text.contains("hypertension") || text.contains("htn")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "Hypertension",
                    "diagnosis",
                    "Objective",
                    ts
            ));
        }

        // Symptom: fatigue
        if (text.contains("fatigue") || text.contains("tired") || text.contains("tiredness")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "Fatigue",
                    "symptom",
                    "Subjective",
                    ts
            ));
        }

        // Medication: metformin
        if (text.contains("metformin")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "Metformin started / adjusted",
                    "medication",
                    "Plan",
                    ts
            ));
        }

        // Lab: HbA1c
        if (text.contains("hba1c")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "HbA1c lab mentioned",
                    "lab",
                    "Objective",
                    ts
            ));
        }

        // Rash / allergy
        if (text.contains("rash") || text.contains("allergy")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "Possible drug rash / allergy",
                    "symptom",
                    "Subjective",
                    ts
            ));
        }

        // Infection / antibiotics
        if (text.contains("infection") || text.contains("antibiotic") || text.contains("abx")) {
            events.add(new TimelineEventDto(
                    UUID.randomUUID().toString(),
                    patientId,
                    "Infection / antibiotic course",
                    "treatment",
                    "Plan",
                    ts
            ));
        }

        return events;
    }
}
