package in.pnkj.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.pnkj.user_service.entity.dto.AuthUserResponseDTO;
import in.pnkj.user_service.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {
    private final UserService userService;

    @GetMapping("/{username}")
    public AuthUserResponseDTO getUserByUsername(@PathVariable String username) {
        return userService.getUserForAuth(username);
    }
}
