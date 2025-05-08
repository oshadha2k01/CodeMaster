package com.codemaster.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codemaster.backend.entity.Follow;
import com.codemaster.backend.entity.FollowStatus;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.UserRepository;
import com.codemaster.backend.service.FollowService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}")
    public Follow sendFollowRequest(@PathVariable Long userId, Principal principal) {
        User follower = userRepository.findByEmail(principal.getName()).orElseThrow();
        User following = userRepository.findById(userId).orElseThrow();
        return followService.requestFollow(follower, following);
    }

    @PostMapping("/accept/{followId}")
    public Follow acceptFollowRequest(@PathVariable Long followId) {
        return followService.acceptFollow(followId);
    }

    @GetMapping("/requests")
    public List<Follow> getPendingRequests(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return followService.getPendingRequests(user);
    }

    @GetMapping("/status/{userId}")
    public Map<String, String> getFollowStatus(@PathVariable Long userId, Principal principal) {
        User follower = userRepository.findByEmail(principal.getName()).orElseThrow();
        User following = userRepository.findById(userId).orElseThrow();
        FollowStatus status = followService.getStatus(follower, following);
        return Map.of("status", status != null ? status.name() : "NONE");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollow(@PathVariable Long userId, Principal principal) {
        User follower = userRepository.findByEmail(principal.getName()).orElseThrow();
        User following = userRepository.findById(userId).orElseThrow();
        followService.unfollow(follower, following);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public Map<String, Integer> getFollowCounts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        int followers = followService.getFollowerCount(user);
        int following = followService.getFollowingCount(user);
        return Map.of("followers", followers, "following", following);
    }

}
