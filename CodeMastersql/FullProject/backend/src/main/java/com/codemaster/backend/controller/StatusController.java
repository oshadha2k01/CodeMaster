package com.codemaster.backend.controller;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codemaster.backend.config.JwtUtil;
import com.codemaster.backend.entity.Status;
import com.codemaster.backend.entity.StatusResponse;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.StatusRepository;
import com.codemaster.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @Autowired
    private StatusRepository statusRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtUtil jwtUtil;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadStatus(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caption") String caption,
            @RequestParam("durationHours") int durationHours,
            @RequestHeader("Authorization") String authHeader
    ) throws Exception {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        User user = userRepo.findByEmail(email).orElseThrow();

        String uniqueName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String fullPath = uploadDir + File.separator + uniqueName;
        String filePath = "/uploads/" + uniqueName;

        // Ensure the directory exists
        new File(uploadDir).mkdirs();

        file.transferTo(new File(fullPath));

        Status status = new Status();
        status.setUser(user);
        status.setCaption(caption);
        status.setImagePath(filePath);
        status.setCreatedAt(LocalDateTime.now());
        status.setExpiresAt(LocalDateTime.now().plusHours(durationHours));

        statusRepo.save(status);

        return ResponseEntity.ok("Status uploaded");
    }

    // @GetMapping
    // public List<Status> getAllActiveStatuses() {
    //     return statusRepo.findByExpiresAtAfter(LocalDateTime.now());
    // }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStatus(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Status status = statusRepo.findById(id).orElseThrow();
        if (!status.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        statusRepo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editStatus(
            @PathVariable Long id,
            @RequestParam("caption") String caption,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String authHeader) throws Exception {

        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Status status = statusRepo.findById(id).orElseThrow();

        if (!status.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        status.setCaption(caption);

        if (file != null && !file.isEmpty()) {
            String uniqueName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String fullPath = uploadDir + File.separator + uniqueName;
            String filePath = "/uploads/" + uniqueName;

            file.transferTo(new File(fullPath));
            status.setImagePath(filePath);
        }

        statusRepo.save(status);
        return ResponseEntity.ok("Status updated");
    }

    @GetMapping
    public ResponseEntity<List<StatusResponse>> getAllActiveStatuses() {
        List<Status> statuses = statusRepo.findByExpiresAtAfter(LocalDateTime.now());

        List<StatusResponse> response = statuses.stream().map(status -> {
            User user = status.getUser();

            Map<String, String> userMap = Map.of(
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "profileImage", user.getProfileImage()
            );

            return new StatusResponse(
                    status.getId(),
                    status.getImagePath(),
                    status.getCaption(),
                    status.getCreatedAt(),
                    status.getExpiresAt(),
                    userMap
            );
        }).toList();

        return ResponseEntity.ok(response);
    }

}
