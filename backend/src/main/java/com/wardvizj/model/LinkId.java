package com.wardvizj.model;

import java.io.Serializable;
import java.util.UUID;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class LinkId implements Serializable {
  private UUID srcEventId; private UUID dstEventId; private String relation;
}
