package com.pnkj.Musy.auth.dto;

import com.pnkj.Musy.user.entity.User;

public record RegisterResDTO(
        Long id,
        String username) {
    public static RegisterResDTO fromEntity(User user) {
        return new RegisterResDTO(user.getUser_id(), user.getUsername());
    }
}
