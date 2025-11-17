package com.wardvizj.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        // Simple JSON so both curl + UI can read it
        return Map.of(
                "service", "api",
                "status", "ok"
        );
    }
}
