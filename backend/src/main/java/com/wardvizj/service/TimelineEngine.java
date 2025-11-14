// service/TimelineEngine.java
package com.wardvizj.service;

import com.wardvizj.model.*;
import com.wardvizj.repo.*;
import com.wardvizj.util.TextSpan;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class TimelineEngine {
  private final EventRepository eventRepo;
  private final LinkRepository linkRepo;

  public List<Event> stitch(String patientId, List<Event> incoming){
    // naive dedupe by (type,label,start day)
    Map<String,Event> map = new LinkedHashMap<>();
    for (Event e : incoming){
      String k = e.getType()+"|"+e.getLabel()+"|"+e.getStartTs().toLocalDate();
      map.putIfAbsent(k, e);
    }
    List<Event> merged = new ArrayList<>(map.values());
    return eventRepo.saveAll(merged);
  }

  public double uncertaintyFor(Event e){
    // simple sigma: labs 0.05, meds 0.15, conditions 0.2; confidence lowers sigma
    double base = switch(e.getType()){
      case "LAB" -> 0.05;
      case "MEDICATION" -> 0.15;
      default -> 0.2;
    };
    double conf = Optional.ofNullable(e.getConfidence()).orElse(0.7);
    return Math.max(0.05, base*(1.1 - conf));
  }

  public Map<UUID, Double> ribbons(List<Event> events){
    return events.stream().collect(Collectors.toMap(Event::getId, this::uncertaintyFor));
  }
}
