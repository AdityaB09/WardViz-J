// service/NlpIngestService.java
package com.wardvizj.service;

import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;
import java.util.regex.*;

@Service
public class NlpIngestService {
  private static final Pattern dateP = Pattern.compile(
   "(\\b20\\d{2}-\\d{2}-\\d{2}\\b|\\b\\d{1,2}/\\d{1,2}/\\d{2,4}\\b)");
  public record Sectioned(String normalizedText, Map<String,String> sections, OffsetDateTime guessedTs){}

  public Sectioned preprocess(String text){
    // Minimal sectioning by SOAP keywords
    Map<String,String> sec = new LinkedHashMap<>();
    Matcher m = Pattern.compile("(?is)(subjective:|objective:|assessment:|plan:)(.*?)(?=subjective:|objective:|assessment:|plan:|\\Z)")
      .matcher(text);
    int hits=0;
    while(m.find()){
      sec.put(m.group(1).toLowerCase().replace(":","").trim(), m.group(2).trim());
      hits++;
    }
    if(hits==0) sec.put("note", text.trim());
    // Guess TS from first date mention (fallback now)
    Matcher dm = dateP.matcher(text);
    OffsetDateTime ts = OffsetDateTime.now();
    if(dm.find()){
      try {
        String d = dm.group(1);
        if (d.contains("-")) ts = LocalDate.parse(d).atStartOfDay().atOffset(ZoneOffset.UTC);
      } catch(Exception ignored){}
    }
    return new Sectioned(text, sec, ts);
  }
}
