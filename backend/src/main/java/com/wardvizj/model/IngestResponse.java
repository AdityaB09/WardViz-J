package com.wardvizj.model;

import java.util.UUID;

public record IngestResponse(
        UUID noteId,
        String patientId,
        int eventsCreated
) {
}
