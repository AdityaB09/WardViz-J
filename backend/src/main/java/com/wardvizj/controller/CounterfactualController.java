// controller/CounterfactualController.java
package com.wardvizj.controller;

import com.wardvizj.model.Event;
import com.wardvizj.service.CounterfactualService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class CounterfactualController {
  private final CounterfactualService svc;

  @PostMapping("/counterfactual")
  public Map<String,Object> counterfactual(@RequestBody CfReq req){
    List<Event> updated = svc.recompute(req.patientId, req.medLabel, req.cutoff);
    return Map.of("updatedEvents", updated, "delta", Map.of("medLabel", req.medLabel, "cutoff", req.cutoff));
  }

  @Data public static class CfReq { public String patientId; public String medLabel; public OffsetDateTime cutoff; }
}
