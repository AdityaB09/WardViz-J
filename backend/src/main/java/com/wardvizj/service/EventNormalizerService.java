// service/EventNormalizerService.java
package com.wardvizj.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EventNormalizerService {
  private static final Map<String,String> codebook = Map.of(
    "type 2 diabetes","SNOMED:44054006",
    "hypertension","SNOMED:38341003",
    "metformin","RxCUI:6809",
    "lisinopril","RxCUI:29046",
    "HbA1c","LOINC:4548-4",
    "rash","SNOMED:271807003");
  public record Norm(String code,String label){}
  public Norm normalize(String label){
    String key = label.toLowerCase().replaceAll("\\s+"," ").trim();
    String code = codebook.getOrDefault(key, null);
    String labLabel = label.startsWith("HbA1c") ? "HbA1c" : label;
    if(code==null && labLabel.equals("HbA1c")) code = codebook.get("HbA1c");
    return new Norm(code, label);
  }
}
