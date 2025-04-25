package com.codemaster.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepositry; // ❌ Typo in JpaRepository

import com.codemaster.backend.entitiy.Post; // ❌ Incorrect package name 'entitiy'
import com.codemaster.backend.entity.User;

public interface PostRepository extends JpaRepositry<Post, Long> { // ❌ Typo in JpaRepository

    List<Post> findByuser(User user); // ❌ Method name should be 'findByUser' (case-sensitive for Spring Data JPA)

    List<Post> findByUserInOrderByCreatedAtAscending(List<User> users); // ❌ Wrong keyword 'Ascending' should be 'Asc' or 'Desc'

    List<Post> findByCreatedDate(Date date); // ❌ Field 'createdDate' might not exist in Post

}
