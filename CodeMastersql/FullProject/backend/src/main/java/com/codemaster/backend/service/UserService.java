package com.codemaster.backend.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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

}
