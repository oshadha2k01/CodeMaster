package com.codemaster.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codemaster.backend.entity.Comment;
import com.codemaster.backend.entity.Post;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.CommentRepository;
import com.codemaster.backend.repository.PostRepository;
import com.codemaster.backend.repository.UserRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment save(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);

        Post post = saved.getPost();
        User commenter = saved.getUser(); // commenter must be set from controller
        User postOwner = post.getUser();

        if (!postOwner.getEmail().equals(commenter.getEmail())) {
            String msg = commenter.getUsername() + " commented on your post: " + post.getTitle();
            notificationService.createNotification(postOwner, msg);
        }

        return saved;
    }

    public List<Comment> getCommentsByPost(Post post) {
        return commentRepository.findByPost(post);
    }

    public Comment getCommentById(Long id) {
        return commentRepository.findById(id).orElseThrow();
    }

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }
}
