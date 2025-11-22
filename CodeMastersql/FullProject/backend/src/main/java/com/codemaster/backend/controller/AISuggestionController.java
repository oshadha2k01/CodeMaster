package com.codemaster.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import com.codemaster.backend.service.GeminiService;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AISuggestionController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/suggest")
    public ResponseEntity<Map<String, String>> getSuggestion(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String suggestion = geminiService.getCodeSuggestion(code);
        return ResponseEntity.ok(Map.of("suggestion", suggestion));
    }

    @PostMapping("/translate")
    public ResponseEntity<Map<String, String>> translate(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String targetLanguage = request.get("targetLanguage");
        String translation = geminiService.translateCode(code, targetLanguage);
        return ResponseEntity.ok(Map.of("translation", translation));
    }

    @PostMapping("/generate-plan")
    public ResponseEntity<String> generatePlan(@RequestBody Map<String, String> request) {
        String goal = request.get("goal");
        String plan = geminiService.generateLearningPlan(goal);
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/refactor")
    public ResponseEntity<Map<String, String>> refactor(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String refactored = geminiService.refactorCode(code);
        return ResponseEntity.ok(Map.of("refactored", refactored));
    }
}
