// service/GuidelineService.java
package com.wardvizj.service;

import com.wardvizj.model.*;
import com.wardvizj.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.*;

@Service @RequiredArgsConstructor
public class GuidelineService {
  private final EventRepository eventRepo;
  private final GuidelineRepository guidRepo;

  /** Rule: IF HbA1c ≥ 8.5 AND Metformin present but dose mention < 1500mg => at-risk; if absent => violated */
  public List<GuidelineResult> evaluate(String patientId){
    List<Event> ev = eventRepo.findByPatientIdOrderByStartTsAsc(patientId);
    Optional<Event> a1c = ev.stream().filter(e -> "LAB".equals(e.getType()) && e.getLabel().toLowerCase().startsWith("hba1c")).max(Comparator.comparing(Event::getStartTs));
    boolean hasMet = ev.stream().anyMatch(e -> "MEDICATION".equals(e.getType()) && e.getLabel().equalsIgnoreCase("metformin"));
    boolean lowDose = ev.stream().anyMatch(e -> "MEDICATION".equals(e.getType()) && e.getLabel().toLowerCase().contains("metformin") &&
      Optional.ofNullable(e.getEvidenceSpan()).orElse("").toLowerCase().contains("500 mg"));
    List<GuidelineResult> out = new ArrayList<>();
    if(a1c.isPresent()){
      double val = parseA1c(a1c.get().getLabel()); // from label "HbA1c 9.2"
      if(val>=8.5){
        String status = hasMet ? (lowDose ? "at-risk" : "met") : "violated";
        String expl = switch(status){
          case "met" -> "ADA: Elevated HbA1c with metformin active or titrated appropriately.";
          case "at-risk" -> "ADA: Consider higher metformin dose; current dose appears low for HbA1c ≥ 8.5%.";
          default -> "ADA: HbA1c ≥ 8.5% without metformin detected.";
        };
        GuidelineResult gr = GuidelineResult.builder()
          .id(UUID.randomUUID()).patientId(patientId).ruleId("ADA_T2D_METFORMIN_8_5")
          .status(status).explanation(expl).evidenceEventIds(new UUID[]{a1c.get().getId()}).build();
        out.add(gr);
      }
    }
    return guidRepo.saveAll(out);
  }

  private double parseA1c(String label){
    var m = Pattern.compile("(\\d+\\.?\\d*)").matcher(label); return m.find()? Double.parseDouble(m.group(1)) : 0.0;
  }
}
