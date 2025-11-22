package com.codemaster.backend.controller;

import com.codemaster.backend.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/execute")
public class ExecutionController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> execute(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("code");
        int languageId = (int) request.get("languageId");
        Map<String, Object> result = codeExecutionService.executeCode(code, languageId);
        return ResponseEntity.ok(result);
    }
}
