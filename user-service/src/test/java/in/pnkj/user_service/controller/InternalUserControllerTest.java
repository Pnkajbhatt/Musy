package in.pnkj.user_service.controller;

import in.pnkj.user_service.dto.AuthUserResponseDTO;
import in.pnkj.user_service.dto.GoogleOAuthRequest;
import in.pnkj.user_service.dto.OAuthUserRequest;
import in.pnkj.user_service.entity.AuthProvider;
import in.pnkj.user_service.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InternalUserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private InternalUserController internalUserController;

    @Test
    void testFindOrCreateGoogleUser() {
        GoogleOAuthRequest request = new GoogleOAuthRequest("google@test.com", "googler", "gid-123");
        AuthUserResponseDTO expected = new AuthUserResponseDTO(1L, "googler", null, "USER");

        when(userService.findOrCreateOAuthUser(AuthProvider.GOOGLE, "google@test.com", "googler", "gid-123"))
                .thenReturn(expected);

        ResponseEntity<AuthUserResponseDTO> response = internalUserController.findOrCreateGoogleUser(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(expected, response.getBody());
    }

    @Test
    void testFindOrCreateOAuthUser_Generic() {
        OAuthUserRequest request = new OAuthUserRequest("github@test.com", "ghuser", AuthProvider.GITHUB, "ghid-456");
        AuthUserResponseDTO expected = new AuthUserResponseDTO(2L, "ghuser", null, "USER");

        when(userService.findOrCreateOAuthUser(AuthProvider.GITHUB, "github@test.com", "ghuser", "ghid-456"))
                .thenReturn(expected);

        ResponseEntity<AuthUserResponseDTO> response = internalUserController.findOrCreateUser(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(expected, response.getBody());
    }

    @Test
    void testFindOrCreateByProviderPathVariable() {
        OAuthUserRequest request = new OAuthUserRequest("git@test.com", "gituser", AuthProvider.GITHUB, "git-789");
        AuthUserResponseDTO expected = new AuthUserResponseDTO(3L, "gituser", null, "USER");

        when(userService.findOrCreateOAuthUser(AuthProvider.GITHUB, "git@test.com", "gituser", "git-789"))
                .thenReturn(expected);

        ResponseEntity<AuthUserResponseDTO> response = internalUserController.findOrCreateByProvider("GITHUB", request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(expected, response.getBody());
    }
}
