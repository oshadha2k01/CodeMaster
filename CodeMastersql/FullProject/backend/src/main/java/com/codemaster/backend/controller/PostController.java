package com.codemaster.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codemaster.backend.config.JwtUtil;
import com.codemaster.backend.entity.Follow;
import com.codemaster.backend.entity.Post;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.PostRepository;
import com.codemaster.backend.repository.UserRepository;
import com.codemaster.backend.service.FollowService;
import com.codemaster.backend.service.PostService;
// import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FollowService followService;

    @Autowired
    private PostRepository postRepository;

    @PostMapping
    @SuppressWarnings("CallToPrintStackTrace")
    public ResponseEntity<Post> createPost(@RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("files") MultipartFile[] files,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
                Path path = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                filePaths.add("/uploads/" + filename);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setMediaPaths(filePaths);
        post.setUser(user);

        return ResponseEntity.ok(postService.save(post));
    }

    @GetMapping("/my")
    public List<Post> myPosts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return postService.getPostsByUser(user);
    }

    @GetMapping("/all")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id, Principal principal) {
        Post post = postService.getPostByIdForUser(id, principal.getName());
        return ResponseEntity.ok(post);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Post> updatePostWithMedia(@PathVariable Long id,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            Principal principal) {
        List<String> filePaths = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
                    Path path = Paths.get(uploadDir, filename);
                    Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                    filePaths.add("/uploads/" + filename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        Post updatedPost = postService.updatePostWithMedia(id, principal.getName(), title, description, filePaths);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Principal principal) {
        postService.deletePostByIdAndUser(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable Long postId, Principal principal) {
        return ResponseEntity.ok(postService.toggleLike(postId, principal.getName()));
    }

    @GetMapping("/{postId}/like-status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(@PathVariable Long postId, Principal principal) {
        Post post = postService.getAllPosts().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean liked = postService.isLikedByUser(postId, principal.getName());
        int likeCount = post.getLikedBy().size();

        return ResponseEntity.ok(Map.of(
                "liked", liked,
                "likeCount", likeCount
        ));
    }

    @GetMapping("/following")
    public List<Post> getFollowingPosts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<User> followingUsers = followService.getAcceptedFollowing(user)
                .stream().map(Follow::getFollowing).toList();

        return postRepository.findByUserInOrderByCreatedAtDesc(followingUsers);
    }

}
