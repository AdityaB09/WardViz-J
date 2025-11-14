// service/ExplainService.java
package com.wardvizj.service;

import com.wardvizj.model.Event;
import com.wardvizj.repo.EventRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.*;

@Service @RequiredArgsConstructor
public class ExplainService {
  private final EventRepository eventRepo;

  public Map<String,Object> explain(UUID eventId){
    Event e = eventRepo.findById(eventId).orElseThrow();
    Map<String,Object> resp = new LinkedHashMap<>();
    resp.put("eventId", e.getId());
    resp.put("label", e.getLabel());
    resp.put("type", e.getType());
    resp.put("confidence", e.getConfidence());
    resp.put("spans", e.getEvidenceSpan()); // JSON string passthrough
    resp.put("sentences", List.of("Detected via rules-first NER and section-aware weighting."));
    resp.put("weights", List.of(0.6,0.4));
    return resp;
  }
}
