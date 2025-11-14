// controller/StoryboardController.java
package com.wardvizj.controller;

import com.wardvizj.model.Event;
import com.wardvizj.repo.EventRepository;
import com.wardvizj.service.TimelineEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class StoryboardController {
  private final EventRepository eventRepo;
  private final TimelineEngine engine;

  @GetMapping("/storyboard/{patientId}")
  public Map<String,Object> storyboard(@PathVariable String patientId){
    List<Event> events = eventRepo.findByPatientIdOrderByStartTsAsc(patientId);
    Map<UUID,Double> ribbons = engine.ribbons(events);
    Map<String,Object> resp = new LinkedHashMap<>();
    resp.put("events", events);
    resp.put("uncertainty", ribbons);
    resp.put("links", List.of()); // simple for MVP
    return resp;
  }
}
