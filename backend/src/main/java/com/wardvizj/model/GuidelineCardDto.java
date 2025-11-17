package com.wardvizj.model;

public record GuidelineCardDto(
        String id,
        String title,
        String status,    // "met", "gap", "consider"
        String rationale,
        String severity   // "high", "medium", "low"
) {
}
