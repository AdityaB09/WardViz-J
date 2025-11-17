package com.wardvizj.model;

public record TimelineEventDto(
        String id,
        String patientId,
        String label,
        String category,
        String section,
        String timestamp
) {
}
