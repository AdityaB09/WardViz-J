package com.wardvizj.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Table(name="guideline_result")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GuidelineResult {
  @Id private UUID id;
  private String patientId;
  private String ruleId;
  private String status; // met | at-risk | violated
  @Column(columnDefinition="TEXT") private String explanation;
  @Column(name="evidence_event_ids", columnDefinition="uuid[]")
  private UUID[] evidenceEventIds;
}
