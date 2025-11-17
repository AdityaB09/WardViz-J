package com.wardvizj.model;

public record EvidenceLinkDto(
        String id,
        String sourceEventId,
        String targetEventId,
        String relation
) {
}
