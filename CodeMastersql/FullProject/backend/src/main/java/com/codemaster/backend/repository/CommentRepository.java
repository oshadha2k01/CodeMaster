package com.codemaster.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codemaster.backend.entity.Comment;
import com.codemaster.backend.entity.Post;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPost(Post post);
}
