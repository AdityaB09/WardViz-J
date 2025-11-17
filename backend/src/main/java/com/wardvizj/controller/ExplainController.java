package com.wardvizj.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")  // adjust or widen if needed
public class ExplainController {

    /**
     * Very simple rewrite endpoint used by the Reading Grade slider.
     * For demo: we just prefix the grade and return the same text.
     *
     * Request JSON:
     * {
     *   "text": "original note text",
     *   "gradeLevel": 8
     * }
     *
     * Response JSON:
     * {
     *   "rewritten": "Grade 8 version: original note text"
     * }
     */
    @PostMapping("/rewrite")
    public Map<String, String> rewrite(@RequestBody RewriteRequest request) {
        String original = request.getText() == null ? "" : request.getText();
        int grade = request.getGradeLevel();

        // For now, just a simple demo transformation.
        // If you want, you can later plug GradeRewriter.rewrite(...) here.
        String rewritten = "Grade " + grade + " version: " + original;

        Map<String, String> response = new HashMap<>();
        response.put("rewritten", rewritten);
        return response;
    }

    public static class RewriteRequest {
        private String text;
        private int gradeLevel;

        public RewriteRequest() {
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public int getGradeLevel() {
            return gradeLevel;
        }

        public void setGradeLevel(int gradeLevel) {
            this.gradeLevel = gradeLevel;
        }
    }
}
