package com.pnkj.Musy.auth.dto;

import com.pnkj.Musy.user.entity.User;

public record RegisterResDTO(
        Long userId,
        String username) {
    public static RegisterResDTO fromEntity(User user) {
        return new RegisterResDTO(user.getUserId(), user.getUsername());
    }
}
