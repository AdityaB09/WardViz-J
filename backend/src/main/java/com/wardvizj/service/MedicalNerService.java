package com.wardvizj.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Phrase lists + regex: fast and demo-friendly */
@Service
public class MedicalNerService {

    // Make this PUBLIC so other packages (controllers) can use it in method signatures
    public static record Mention(String type, String label, double prob, int start, int end) {}

    private static final String[] CONDITIONS = {
            "type 2 diabetes", "hypertension", "rash", "stroke", "ckd"
    };
    private static final String[] MEDS = {
            "metformin", "lisinopril", "amoxicillin", "insulin"
    };
    private static final Pattern HBA1C = Pattern.compile(
            "\\b(?:HbA1c|A1c)\\s*([0-9]+\\.?[0-9]?)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public List<Mention> extract(String text) {
        List<Mention> m = new ArrayList<>();

        // conditions
        for (String c : CONDITIONS) {
            Pattern p = Pattern.compile("\\b" + Pattern.quote(c) + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher mm = p.matcher(text);
            while (mm.find()) {
                m.add(new Mention("CONDITION", c, 0.9, mm.start(), mm.end()));
            }
        }

        // medications
        for (String d : MEDS) {
            Pattern p = Pattern.compile("\\b" + Pattern.quote(d) + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher mm = p.matcher(text);
            while (mm.find()) {
                m.add(new Mention("MEDICATION", d, 0.85, mm.start(), mm.end()));
            }
        }

        // HbA1c values
        Matcher a = HBA1C.matcher(text);
        while (a.find()) {
            m.add(new Mention("LAB", "HbA1c " + a.group(1), 0.95, a.start(), a.end()));
        }

        return m;
    }
}
