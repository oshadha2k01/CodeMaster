package com.codemaster.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class CodeExecutionService {

    // Using Judge0 free public API for demonstration
    private final String JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
    private final String RAPID_API_KEY = "a9f2c06313mshd336f04c380a44fp1f29fajsn8e14e5d68826";

    public Map<String, Object> executeCode(String code, int languageId) {
        if (RAPID_API_KEY.isBlank()) {
            return Map.of("stdout", "Error: RapidAPI Key for Judge0 is missing. Please add it to CodeExecutionService.", "status", Map.of("description", "Configuration Error"));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", RAPID_API_KEY);
            headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("source_code", code);
            requestBody.put("language_id", languageId);
            requestBody.put("stdin", "");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(JUDGE0_URL, entity, Map.class);

            return response.getBody();
        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }
}
