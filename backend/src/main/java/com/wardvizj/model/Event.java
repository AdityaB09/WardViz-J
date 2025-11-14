package com.wardvizj.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity @Table(name="event")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
  @Id private UUID id;
  private String patientId;
  private String type; // EventType
  private String code; // SNOMED/LOINC (candidate)
  private String label;
  private OffsetDateTime startTs;
  private OffsetDateTime endTs;
  private Double confidence;
  @ManyToOne @JoinColumn(name="source_note_id")
  private Note sourceNote;
  @Column(columnDefinition="jsonb")
  private String evidenceSpan; // JSON string array of {start,end,sentence,weight}
}
