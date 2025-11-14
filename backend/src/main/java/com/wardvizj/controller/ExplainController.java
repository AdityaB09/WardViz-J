// controller/ExplainController.java
package com.wardvizj.controller;

import com.wardvizj.service.ExplainService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.UUID;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class ExplainController {
  private final ExplainService svc;
  @GetMapping("/explain/{eventId}")
  public Map<String,Object> explain(@PathVariable UUID eventId){ return svc.explain(eventId); }

  @GetMapping("/health")
  public Map<String,String> health(){ return Map.of("service","api","status","ok"); }
}
