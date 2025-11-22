package com.codemaster.backend.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.codemaster.backend.repository.PostRepository;
import com.codemaster.backend.repository.FollowRepository;
import com.codemaster.backend.repository.LearningPlanRepository;
import com.codemaster.backend.repository.NotificationRepository;
import com.codemaster.backend.repository.StatusRepository;
import java.util.List;
import com.codemaster.backend.entity.Post;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.codemaster.backend.config.JwtUtil;
import com.codemaster.backend.entity.Role;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String registerUser(String username, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already in use";
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Collections.singleton(Role.USER));

        userRepository.save(user);
        return "User registered successfully";
    }

    public String authenticateUser(String email, String password) {
        System.out.println("Trying to authenticate: " + email);

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            System.out.println("User not found");
            return "Invalid credentials";
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Password mismatch");
            return "Invalid credentials";
        }

        System.out.println("Authenticated successfully");
        return jwtUtil.generateToken(email);
    }

    public String updateUserProfile(String currentEmail, String newUsername, String newEmail, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(currentEmail);
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();

        // If email is changing, ensure it's not already used
        if (!newEmail.equals(currentEmail) && userRepository.findByEmail(newEmail).isPresent()) {
            return "Email already in use";
        }

        user.setUsername(newUsername);
        user.setEmail(newEmail);

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
        return "Profile updated successfully";
    }

    @Transactional
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // Delete associated media files for user's posts
        List<Post> posts = postRepository.findByUser(user);
        for (Post post : posts) {
            for (String mediaPath : post.getMediaPaths()) {
                try {
                    String filename = mediaPath.substring(mediaPath.lastIndexOf("/") + 1);
                    Path filePath = Paths.get(uploadDir, filename);
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // Delete other related entities
        postRepository.deleteAll(posts);
        learningPlanRepository.deleteByUser(user);
        followRepository.deleteByFollowing(user);
        followRepository.deleteByFollower(user);
        statusRepository.deleteByUser(user);
        notificationRepository.deleteByUser(user);

        userRepository.delete(user);
    }

}
