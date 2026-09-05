package com.pnkj.Musy.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pnkj.Musy.user.entity.Role;
import com.pnkj.Musy.user.entity.RoleType;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}