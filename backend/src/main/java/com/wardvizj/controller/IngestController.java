package com.wardvizj.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wardvizj.service.NlpIngestService;
import com.wardvizj.service.NlpIngestService.IngestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class IngestController {

    private static final Logger log = LoggerFactory.getLogger(IngestController.class);

    private final NlpIngestService nlpIngestService;

    public IngestController(NlpIngestService nlpIngestService) {
        this.nlpIngestService = nlpIngestService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<?> ingest(@RequestBody IngestRequest request) {
        try {
            IngestResult result =
                    nlpIngestService.ingest(request.getPatientId(), request.getText());
            return ResponseEntity.ok(result);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize sections JSON for patient {}", request.getPatientId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "JSON_SERIALIZATION_FAILED",
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error during ingest for patient {}", request.getPatientId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "INGEST_FAILED",
                            "message", e.getMessage()
                    ));
        }
    }

    // Simple request DTO that matches your curl payload
    public static class IngestRequest {
        private String patientId;
        private String text;

        public String getPatientId() {
            return patientId;
        }

        public void setPatientId(String patientId) {
            this.patientId = patientId;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
