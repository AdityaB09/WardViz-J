package com.wardvizj.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity @Table(name="note")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Note {
  @Id private UUID id;
  private String patientId;
  private OffsetDateTime ts;
  @Column(columnDefinition="TEXT") private String text;
  @Column(columnDefinition="jsonb") private String sections; // JSON string
}
