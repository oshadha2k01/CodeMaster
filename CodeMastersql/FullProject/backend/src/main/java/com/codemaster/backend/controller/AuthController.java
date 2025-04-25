package com.codemaster.backend.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codemaster.backend.entity.Role;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.FollowRepository;
import com.codemaster.backend.repository.LearningPlanRepository;
import com.codemaster.backend.repository.NotificationRepository;
import com.codemaster.backend.repository.PostRepository;
import com.codemaster.backend.repository.StatusRepository;
import com.codemaster.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private com.codemaster.backend.config.JwtUtil jwtUtil;
    @Autowired
    private com.codemaster.backend.repository.UserRepository userRepository;
    @Value("${file.upload-dir}")
    private String uploadDir;
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private FollowRepository followRepository;
    @Autowired
    private StatusRepository statusRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping(value = "/signup-with-image", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> signupWithImage(
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(new BCryptPasswordEncoder().encode(password));
        user.setRoles(Collections.singleton(Role.USER));

        if (file != null && !file.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = "/uploads/" + filename;
            File destFile = new File(uploadDir + File.separator + filename);
            destFile.getParentFile().mkdirs();
            file.transferTo(destFile);
            user.setProfileImage(filePath);
        }

        userRepository.save(user);
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signin(@RequestBody Map<String, String> request) {
        String token = userService.authenticateUser(request.get("email"), request.get("password"));
        if (token.equals("Invalid credentials")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", token));
        }
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws IOException {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow();

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get("src/main/resources/static/uploads/" + filename);
        Files.write(path, file.getBytes());

        user.setProfileImage("/uploads/" + filename);
        userRepository.save(user);

        return ResponseEntity.ok(user.getProfileImage());
    }

    @PutMapping(value = "/update-profile", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> updateProfile(
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) throws IOException {

        String token = request.getHeader("Authorization").substring(7);
        String userEmail = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        // ✅ Handle image upload
        if (file != null && !file.isEmpty()) {
            String uniqueName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String fullPath = uploadDir + File.separator + uniqueName;
            String filePath = "/uploads/" + uniqueName;

            File destFile = new File(fullPath);
            destFile.getParentFile().mkdirs();
            file.transferTo(destFile);

            user.setProfileImage(filePath);
        }

        // ✅ Email uniqueness check
        if (!user.getEmail().equals(email) && userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        user.setUsername(username);
        user.setEmail(email);

        if (password != null && !password.isBlank()) {
            user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(password));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @Transactional
    @DeleteMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        // ✅ Ensure all deletions are wrapped in a transaction
        postRepository.deleteAll(postRepository.findByUser(user));
        learningPlanRepository.deleteByUser(user);
        followRepository.deleteByFollowing(user);
        followRepository.deleteByFollower(user);
        statusRepository.deleteByUser(user);
        notificationRepository.deleteByUser(user);

        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

}
