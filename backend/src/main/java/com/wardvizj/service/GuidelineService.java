package com.wardvizj.service;

import com.wardvizj.model.GuidelineCardDto;
import com.wardvizj.model.Note;
import com.wardvizj.repo.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GuidelineService {

    private final NoteRepository noteRepository;

    public GuidelineService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    /**
     * Evaluate a patient's latest note and generate simple guideline cards.
     * Different note contents → different combinations of cards.
     */
    public List<GuidelineCardDto> evaluatePatient(String patientId) {
        List<Note> allNotes = noteRepository.findAll();

        Optional<Note> latest = allNotes.stream()
                .filter(n -> patientId.equals(n.getPatientId()))
                .max(Comparator.comparing(Note::getTs, Comparator.nullsLast(Comparator.naturalOrder())));

        if (latest.isEmpty()) {
            return List.of();
        }

        return evaluateText(patientId, Optional.ofNullable(latest.get().getText()).orElse(""));
    }

    private List<GuidelineCardDto> evaluateText(String patientId, String rawText) {
        String text = rawText.toLowerCase(Locale.ROOT);
        List<GuidelineCardDto> cards = new ArrayList<>();

        // --- Diabetes / HbA1c logic ---
        boolean hasDiabetes = text.contains("type 2 diabetes") || text.contains("t2d") || text.contains("diabetes");
        Double hba1c = extractHba1c(text);

        if (hasDiabetes) {
            cards.add(new GuidelineCardDto(
                    UUID.randomUUID().toString(),
                    "Confirm Type 2 Diabetes diagnosis",
                    "met",
                    "Problem list already mentions diabetes for patient " + patientId + ".",
                    "medium"
            ));
        }

        if (hba1c != null) {
            if (hba1c >= 9.0) {
                cards.add(new GuidelineCardDto(
                        UUID.randomUUID().toString(),
                        "HbA1c above recommended target",
                        "gap",
                        "Latest HbA1c is " + hba1c + "% (target often < 7% for many adults).",
                        "high"
                ));
            } else if (hba1c > 7.0) {
                cards.add(new GuidelineCardDto(
                        UUID.randomUUID().toString(),
                        "HbA1c slightly above target",
                        "consider",
                        "HbA1c is " + hba1c + "%; consider lifestyle optimization or medication adjustment.",
                        "medium"
                ));
            } else {
                cards.add(new GuidelineCardDto(
                        UUID.randomUUID().toString(),
                        "HbA1c at or below target",
                        "met",
                        "HbA1c is " + hba1c + "%; continue current regimen and monitoring.",
                        "low"
                ));
            }
        }

        // Metformin
        if (text.contains("metformin")) {
            cards.add(new GuidelineCardDto(
                    UUID.randomUUID().toString(),
                    "On metformin therapy",
                    "met",
                    "Metformin is documented; ensure dose and kidney function are appropriate.",
                    "medium"
            ));
            if (hba1c != null && hba1c >= 9.0) {
                cards.add(new GuidelineCardDto(
                        UUID.randomUUID().toString(),
                        "Consider intensifying diabetes regimen",
                        "gap",
                        "Despite metformin, HbA1c is " + hba1c + "%; consider uptitration or adding a second agent.",
                        "high"
                ));
            }
        }

        // Hypertension
        if (text.contains("hypertension") || text.contains("htn") || text.contains("blood pressure")) {
            cards.add(new GuidelineCardDto(
                    UUID.randomUUID().toString(),
                    "Blood pressure control",
                    "consider",
                    "Hypertension is mentioned; check if BP meets guideline targets and meds are optimized.",
                    "medium"
            ));
        }

        // Rash / allergy
        if (text.contains("rash") || text.contains("allergy")) {
            cards.add(new GuidelineCardDto(
                    UUID.randomUUID().toString(),
                    "Evaluate potential drug allergy",
                    "consider",
                    "Rash/allergy is mentioned; verify if it is medication-related and update allergy list.",
                    "high"
            ));
        }

        // Infection / antibiotics
        if (text.contains("infection") || text.contains("antibiotic") || text.contains("abx")) {
            cards.add(new GuidelineCardDto(
                    UUID.randomUUID().toString(),
                    "Antibiotic course review",
                    "consider",
                    "Infection/antibiotic use mentioned; confirm indication, spectrum, and duration.",
                    "medium"
            ));
        }

        return cards;
    }

    /**
     * Very simple regex to pull HbA1c like "HbA1c 9.2" from free text.
     */
    private Double extractHba1c(String text) {
        Pattern p = Pattern.compile("hba1c\\s*(\\d+(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(text);
        if (m.find()) {
            try {
                return Double.parseDouble(m.group(1));
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }
}
