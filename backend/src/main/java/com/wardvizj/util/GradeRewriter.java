// util/GradeRewriter.java
package com.wardvizj.util;

import org.apache.commons.text.WordUtils;
import java.util.*;
import java.util.regex.*;

/** Ultra-light rewrite by splitting long sentences and simplifying known phrases. */
public class GradeRewriter {
  private static final Map<String,String> simplify = Map.of(
    "hyperglycemia","high blood sugar",
    "hypertension","high blood pressure",
    "metformin hydrochloride","metformin"
  );
  public static String rewrite(String text, int grade){
    String t = text;
    for (var e : simplify.entrySet()){
      t = t.replaceAll("(?i)\\b"+Pattern.quote(e.getKey())+"\\b", e.getValue());
    }
    // Split long sentences
    String[] sents = t.split("(?<=[.!?])\\s+");
    List<String> out = new ArrayList<>();
    for (String s : sents){
      if (s.length()>120 && grade<=9){
        out.addAll(Arrays.asList(s.split(",(?=\\s[a-zA-Z])", 2)));
      } else out.add(s);
    }
    return WordUtils.capitalize(out.stream().map(String::trim).reduce((a,b)->a+" "+b).orElse(t));
  }
}
