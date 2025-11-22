package com.codemaster.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.codemaster.backend.entity.Post;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.PostRepository;
import com.codemaster.backend.repository.UserRepository;
import com.codemaster.backend.repository.CommentRepository;
import com.codemaster.backend.dto.PostDTO;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import java.io.File;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CommentRepository commentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    public PostDTO convertToDTO(Post post, String currentUserEmail) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setMediaPaths(post.getMediaPaths());
        dto.setCreatedAt(post.getCreatedAt());
        
        PostDTO.UserDTO userDto = new PostDTO.UserDTO();
        userDto.setId(post.getUser().getId());
        userDto.setUsername(post.getUser().getUsername());
        userDto.setEmail(post.getUser().getEmail());
        userDto.setProfileImage(post.getUser().getProfileImage());
        dto.setUser(userDto);

        dto.setLikeCount(post.getLikedBy().size());
        dto.setLiked(post.getLikedBy().stream().anyMatch(u -> u.getEmail().equals(currentUserEmail)));
        dto.setCommentCount(commentRepository.countByPost(post));
        
        dto.setLatestComments(commentRepository.findByPost(post).stream()
                .sorted((c1, c2) -> c2.getId().compareTo(c1.getId()))
                .limit(3)
                .map(c -> {
                    PostDTO.CommentDTO cDto = new PostDTO.CommentDTO();
                    cDto.setId(c.getId());
                    cDto.setContent(c.getContent());
                    PostDTO.UserDTO cuDto = new PostDTO.UserDTO();
                    cuDto.setId(c.getUser().getId());
                    cuDto.setUsername(c.getUser().getUsername());
                    cuDto.setEmail(c.getUser().getEmail());
                    cuDto.setProfileImage(c.getUser().getProfileImage());
                    cDto.setUser(cuDto);
                    return cDto;
                })
                .collect(Collectors.toList()));

        return dto;
    }

    public List<PostDTO> getAllPostsDTO(String currentUserEmail) {
        return postRepository.findAll().stream()
                .map(p -> convertToDTO(p, currentUserEmail))
                .collect(Collectors.toList());
    }

    public Post save(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUser(User user) {
        return postRepository.findByUser(user);
    }

    public Post updatePostWithMedia(Long postId, String userEmail, String title, String description, List<String> newMediaPaths) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not authorized to update this post");
        }

        post.setTitle(title);
        post.setDescription(description);

        if (!newMediaPaths.isEmpty()) {
            // Optional: delete old files if replacing
            for (String oldPath : post.getMediaPaths()) {
                try {
                    // Extract filename from /uploads/filename
                    String filename = oldPath.substring(oldPath.lastIndexOf("/") + 1);
                    Path filePath = Paths.get(uploadDir, filename);
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            post.setMediaPaths(newMediaPaths);
        }

        return postRepository.save(post);
    }

    public Post getPostByIdForUser(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("Unauthorized access to post");
        }

        return post;
    }

    public void deletePostByIdAndUser(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("Unauthorized to delete this post");
        }

        // Delete associated media files from disk
        for (String mediaPath : post.getMediaPaths()) {
            try {
                String filename = mediaPath.substring(mediaPath.lastIndexOf("/") + 1);
                Path filePath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace(); // Optional: log or handle
            }
        }

        postRepository.delete(post);
    }

    // public Post toggleLike(Long postId, String userEmail) {
    //     Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
    //     User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
    //     if (post.getLikedBy().contains(user)) {
    //         post.getLikedBy().remove(user);
    //     } else {
    //         post.getLikedBy().add(user);
    //     }
    //     return postRepository.save(post);
    // }
    public Post toggleLike(Long postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User liker = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User postOwner = post.getUser();

        boolean alreadyLiked = post.getLikedBy().contains(liker);

        if (alreadyLiked) {
            post.getLikedBy().remove(liker);
        } else {
            post.getLikedBy().add(liker);

            // ✅ Send notification only if not liking own post
            if (!postOwner.getEmail().equals(userEmail)) {
                String message = liker.getUsername() + " liked your post: " + post.getTitle();
                notificationService.createNotification(postOwner, message);
            }
        }

        return postRepository.save(post);
    }

    public boolean isLikedByUser(Long postId, String userEmail) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        return post.getLikedBy().contains(user);
    }

}
