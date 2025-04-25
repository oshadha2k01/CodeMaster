package com.codemaster.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codemaster.backend.entity.LearningPlan;
import com.codemaster.backend.entity.User;

// public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
//     List<LearningPlan> findByUser(User user);
// }
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {

    void deleteByUser(User user); // for manual deletion if needed

    List<LearningPlan> findByUser(User user);
}
