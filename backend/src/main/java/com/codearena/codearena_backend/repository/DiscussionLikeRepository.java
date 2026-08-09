package com.codearena.codearena_backend.repository;

import com.codearena.codearena_backend.entity.DiscussionLike;
import com.codearena.codearena_backend.entity.DiscussionPost;
import com.codearena.codearena_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscussionLikeRepository extends JpaRepository<DiscussionLike, Long> {
    int countByPost(DiscussionPost post);
    Optional<DiscussionLike> findByPostAndUser(DiscussionPost post, User user);
    boolean existsByPostAndUser(DiscussionPost post, User user);
}
