package com.codemaster.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public String getCodeSuggestion(String code) {
        if (apiKey == null || apiKey.isBlank()) {
            return "AI Suggestion Error: Gemini API key is missing. Please add 'gemini.api.key' to your application.properties.";
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Constructing the prompt for code analysis
            String prompt = "You are an expert software architect. Analyze the following code snippet and provide 3-4 concise, professional recommendations for optimization, security, or clean code. Format the output in Markdown bullet points. Code: \n\n" + code;

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            }
        } catch (Exception e) {
            return "AI Suggestion Error: " + e.getMessage();
        }

        return "Could not generate AI suggestion at this time.";
    }

    public String translateCode(String code, String targetLanguage) {
        if (apiKey == null || apiKey.isBlank()) {
            return "AI Translation Error: Gemini API key is missing.";
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String prompt = "You are a polyglot programmer. Translate the following code snippet accurately into " + targetLanguage + ". Only return the translated code, no explanations. Code: \n\n" + code;

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            }
        } catch (Exception e) {
            return "AI Translation Error: " + e.getMessage();
        }
        return "Could not translate code at this time.";
    }

    public String generateLearningPlan(String goal) {
        if (apiKey == null || apiKey.isBlank()) {
            return "{\"error\": \"Gemini API key is missing.\"}";
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String prompt = "Create a structured learning plan for the goal: \"" + goal + "\". " +
                    "Respond ONLY with a JSON object in this format: " +
                    "{\"title\": \"Plan Title\", \"topics\": [\"Topic 1\", \"Topic 2\"], \"resources\": [\"Resource 1 URL\", \"Resource 2 URL\"]}. " +
                    "Provide 4-6 topics and 3-4 high-quality web resources (links or descriptions).";

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String text = (String) parts.get(0).get("text");
                // Clean up markdown code blocks if any
                return text.replaceAll("```json", "").replaceAll("```", "").trim();
            }
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
        return "{\"error\": \"Could not generate plan.\"}";
    }

    public String refactorCode(String code) {
        if (apiKey == null || apiKey.isBlank()) {
            return "AI Refactor Error: Gemini API key is missing.";
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String prompt = "You are a senior principal engineer. Refactor the following code to be more optimized, readable, and follow best practices. Only return the refactored code, no explanations. Code: \n\n" + code;

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String text = (String) parts.get(0).get("text");
                return text.replaceAll("```[a-z]*", "").replaceAll("```", "").trim();
            }
        } catch (Exception e) {
            return "AI Refactor Error: " + e.getMessage();
        }
        return "Could not refactor code at this time.";
    }
}
