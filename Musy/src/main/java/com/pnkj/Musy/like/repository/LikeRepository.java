package com.pnkj.Musy.like.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pnkj.Musy.like.entity.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
}
