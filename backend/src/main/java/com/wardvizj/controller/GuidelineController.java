package com.wardvizj.controller;

import com.wardvizj.model.GuidelineCardDto;
import com.wardvizj.model.GuidelineResponse;
import com.wardvizj.service.GuidelineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GuidelineController {

    private final GuidelineService guidelineService;

    public GuidelineController(GuidelineService guidelineService) {
        this.guidelineService = guidelineService;
    }

    @GetMapping("/guidelines/{patientId}")
    public GuidelineResponse guidelines(@PathVariable String patientId) {
        List<GuidelineCardDto> cards = guidelineService.evaluatePatient(patientId);
        return new GuidelineResponse(cards);
    }
}
