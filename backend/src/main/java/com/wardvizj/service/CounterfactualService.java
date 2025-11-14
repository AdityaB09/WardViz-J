// service/CounterfactualService.java
package com.wardvizj.service;

import com.wardvizj.model.Event;
import com.wardvizj.repo.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class CounterfactualService {
  private final EventRepository eventRepo;

  public List<Event> recompute(String patientId, String medLabel, OffsetDateTime cutoff){
    List<Event> ev = eventRepo.findByPatientIdOrderByStartTsAsc(patientId);
    // remove medication events after cutoff; slightly lower risk signals (toy)
    return ev.stream().map(e -> {
      if ("MEDICATION".equals(e.getType()) && e.getLabel().equalsIgnoreCase(medLabel) && e.getStartTs().isAfter(cutoff)){
        return null; // dropped
      }
      if ("RISK_SIGNAL".equals(e.getType())){
        e.setConfidence(Math.min(1.0, e.getConfidence()==null?0.6:e.getConfidence()+0.05));
      }
      return e;
    }).filter(Objects::nonNull).collect(Collectors.toList());
  }
}
