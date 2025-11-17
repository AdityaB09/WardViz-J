package com.wardvizj.model;

import java.util.List;
import java.util.Map;

public record StoryboardResponse(
        List<TimelineEventDto> events,
        Map<String, Double> uncertainty,
        List<EvidenceLinkDto> links
) {
}
