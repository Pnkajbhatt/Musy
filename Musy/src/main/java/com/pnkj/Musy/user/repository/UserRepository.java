package com.pnkj.Musy.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pnkj.Musy.user.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
