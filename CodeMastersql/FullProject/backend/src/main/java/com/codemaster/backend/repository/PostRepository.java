package com.codemaster.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codemaster.backend.entity.Post;
import com.codemaster.backend.entity.User;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUser(User user);

    List<Post> findByUserInOrderByCreatedAtDesc(List<User> users);

}
