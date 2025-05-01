package com.codemaster.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codemaster.backend.entity.LearningPlan;
import com.codemaster.backend.entity.LearningPlanResponse;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.UserRepository;
import com.codemaster.backend.service.LearningPlanService;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService planService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlan plan, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        plan.setUser(user);
        LearningPlan savedPlan = planService.save(plan);
        return ResponseEntity.ok(savedPlan);
    }

    @GetMapping("/my")
    public ResponseEntity<List<LearningPlan>> getMyPlans(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        List<LearningPlan> plans = planService.getPlansByUser(user);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LearningPlanResponse>> getAllPlans() {
        List<LearningPlanResponse> plans = planService.getAllPlansAsResponse();
        return ResponseEntity.ok(plans);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        LearningPlan plan = planService.getPlanById(id);

        if (!plan.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        planService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
