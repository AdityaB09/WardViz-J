package com.wardvizj.controller;

import com.wardvizj.model.EvidenceLinkDto;
import com.wardvizj.model.StoryboardResponse;
import com.wardvizj.model.TimelineEventDto;
import com.wardvizj.service.TimelineEngine;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StoryboardController {

    private final TimelineEngine timelineEngine;

    public StoryboardController(TimelineEngine timelineEngine) {
        this.timelineEngine = timelineEngine;
    }

    @GetMapping("/storyboard/{patientId}")
    public StoryboardResponse storyboard(@PathVariable String patientId) {
        List<TimelineEventDto> events = timelineEngine.buildTimelineForPatient(patientId);
        Map<String, Double> uncertainty = timelineEngine.estimateUncertainty(events);
        List<EvidenceLinkDto> links = timelineEngine.buildLinks(events);
        return new StoryboardResponse(events, uncertainty, links);
    }
}
