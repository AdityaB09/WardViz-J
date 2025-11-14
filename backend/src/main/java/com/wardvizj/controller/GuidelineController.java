// controller/GuidelineController.java
package com.wardvizj.controller;

import com.wardvizj.model.GuidelineResult;
import com.wardvizj.repo.GuidelineRepository;
import com.wardvizj.service.GuidelineService;
import com.wardvizj.util.GradeRewriter;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class GuidelineController {
  private final GuidelineService svc;
  private final GuidelineRepository repo;

  @GetMapping("/guidelines/{patientId}")
  public Map<String,Object> guidelines(@PathVariable String patientId){
    List<GuidelineResult> res = svc.evaluate(patientId);
    return Map.of("cards", res);
  }

  @PostMapping("/rewrite")
  public Map<String,String> rewrite(@RequestBody RewriteReq req){
    return Map.of("text", GradeRewriter.rewrite(req.text, req.grade));
  }
  @Data public static class RewriteReq{ public String text; public int grade=10; }
}
