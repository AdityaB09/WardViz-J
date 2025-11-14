package com.wardvizj.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="link")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@IdClass(LinkId.class)
public class Link {
  @Id private java.util.UUID srcEventId;
  @Id private java.util.UUID dstEventId;
  @Id private String relation; // EventRelation
}
