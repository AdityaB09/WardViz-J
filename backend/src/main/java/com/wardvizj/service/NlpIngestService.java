package com.wardvizj.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wardvizj.model.Note;
import com.wardvizj.repo.NoteRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.UUID;

@Service
public class NlpIngestService {

    private final NoteRepository noteRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NlpIngestService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public IngestResult ingest(String patientId, String text) throws JsonProcessingException {
        Note note = new Note();
        note.setId(UUID.randomUUID());
        note.setPatientId(patientId);
        note.setText(text);
        note.setTs(OffsetDateTime.now(ZoneOffset.UTC));

        // For now, store a simple JSON with the raw note text.
        Map<String, Object> sections = Map.of(
                "raw", text
        );
        String sectionsJson = objectMapper.writeValueAsString(sections);
        note.setSections(sectionsJson);

        noteRepository.save(note);

        IngestResult result = new IngestResult();
        result.setNoteId(note.getId());
        result.setPatientId(patientId);
        result.setEventsCreated(0); // you can bump this later when you wire TimelineEngine
        return result;
    }

    // Simple DTO class for response
    public static class IngestResult {
        private UUID noteId;
        private String patientId;
        private int eventsCreated;

        public UUID getNoteId() {
            return noteId;
        }

        public void setNoteId(UUID noteId) {
            this.noteId = noteId;
        }

        public String getPatientId() {
            return patientId;
        }

        public void setPatientId(String patientId) {
            this.patientId = patientId;
        }

        public int getEventsCreated() {
            return eventsCreated;
        }

        public void setEventsCreated(int eventsCreated) {
            this.eventsCreated = eventsCreated;
        }
    }
}
