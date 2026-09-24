package in.pnkj.user_service.controller;

import in.pnkj.user_service.dto.AuthUserResponseDTO;
import in.pnkj.user_service.dto.GoogleOAuthRequest;
import in.pnkj.user_service.dto.OAuthUserRequest;
import in.pnkj.user_service.entity.AuthProvider;
import in.pnkj.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {
    private final UserService userService;

    @GetMapping("/{username}")
    public AuthUserResponseDTO getUserByUsername(@PathVariable String username) {
        return userService.getUserForAuth(username);
    }

    @GetMapping("/id/{userId}")
    public AuthUserResponseDTO getUserById(@PathVariable Long userId) {
        return userService.getUserByIdForAuth(userId);
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<AuthUserResponseDTO> findOrCreateGoogleUser(@RequestBody GoogleOAuthRequest request) {
        AuthUserResponseDTO response = userService.findOrCreateOAuthUser(
                AuthProvider.GOOGLE,
                request.email(),
                request.username(),
                request.providerId()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth/find-or-create")
    public ResponseEntity<AuthUserResponseDTO> findOrCreateUser(@Valid @RequestBody OAuthUserRequest request) {
        AuthUserResponseDTO response = userService.findOrCreateOAuthUser(
                request.provider(),
                request.email(),
                request.username(),
                request.providerId()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth")
    public ResponseEntity<AuthUserResponseDTO> findOrCreateUserOAuth(@Valid @RequestBody OAuthUserRequest request) {
        return findOrCreateUser(request);
    }

    @PostMapping("/oauth/{provider}")
    public ResponseEntity<AuthUserResponseDTO> findOrCreateByProvider(
            @PathVariable String provider,
            @RequestBody OAuthUserRequest request) {
        AuthProvider authProvider = AuthProvider.valueOf(provider.toUpperCase());
        AuthUserResponseDTO response = userService.findOrCreateOAuthUser(
                authProvider,
                request.email(),
                request.username(),
                request.providerId()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-provider-and-email")
    public ResponseEntity<AuthUserResponseDTO> getUserByProviderAndEmail(
            @RequestParam AuthProvider provider,
            @RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByProviderAndEmail(provider, email));
    }
}
