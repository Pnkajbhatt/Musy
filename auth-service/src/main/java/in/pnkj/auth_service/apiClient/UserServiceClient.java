package in.pnkj.auth_service.apiClient;

import in.pnkj.auth_service.dto.GoogleOAuthRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import in.pnkj.auth_service.dto.AuthUserDTO;
import in.pnkj.auth_service.dto.CreateUserRequest;
import in.pnkj.auth_service.dto.UserResponseDTO;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    @PostMapping("/api/users")
    UserResponseDTO createUser(@RequestBody CreateUserRequest request);

    @GetMapping("/internal/users/{username}")
    AuthUserDTO getUserByUsername(@PathVariable("username") String username);

    @GetMapping("/internal/users/id/{userId}")
    AuthUserDTO getUserById(@PathVariable("userId") Long userId);

    @PostMapping("/internal/users/oauth/google")
    AuthUserDTO findOrCreateGoogleUser(@RequestBody GoogleOAuthRequest request);
}
