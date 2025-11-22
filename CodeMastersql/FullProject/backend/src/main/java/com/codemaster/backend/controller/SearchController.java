package com.codemaster.backend.controller;

import com.codemaster.backend.dto.PostDTO;
import com.codemaster.backend.entity.LearningPlan;
import com.codemaster.backend.entity.Post;
import com.codemaster.backend.repository.LearningPlanRepository;
import com.codemaster.backend.repository.PostRepository;
import com.codemaster.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(@RequestParam("q") String query, Principal principal) {
        if (query == null || query.length() < 2) {
            return ResponseEntity.ok(Map.of("posts", List.of(), "plans", List.of()));
        }

        // Search Posts
        List<PostDTO> posts = postRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(p -> postService.convertToDTO(p, principal.getName()))
                .collect(Collectors.toList());

        // Search Learning Plans
        List<LearningPlan> plans = learningPlanRepository.findByTitleContainingIgnoreCase(query);

        Map<String, Object> results = new HashMap<>();
        results.put("posts", posts);
        results.put("plans", plans);

        return ResponseEntity.ok(results);
    }
}
