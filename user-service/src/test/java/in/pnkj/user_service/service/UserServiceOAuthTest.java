package in.pnkj.user_service.service;

import in.pnkj.user_service.dto.AuthUserResponseDTO;
import in.pnkj.user_service.entity.AuthProvider;
import in.pnkj.user_service.entity.Role;
import in.pnkj.user_service.entity.RoleType;
import in.pnkj.user_service.entity.User;
import in.pnkj.user_service.repo.ArtistApplicationRepository;
import in.pnkj.user_service.repo.RoleRepository;
import in.pnkj.user_service.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceOAuthTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ArtistApplicationRepository artistApplicationRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private UserService userService;

    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role(2L, RoleType.USER);
    }

    @Test
    void testFindOrCreateOAuthUser_ExistingUserByProviderId() {
        User existing = User.builder()
                .userId(1L)
                .username("john_doe")
                .email("john@example.com")
                .authProvider(AuthProvider.GOOGLE)
                .providerId("google-12345")
                .role(userRole)
                .build();

        when(userRepository.findByAuthProviderAndProviderId(AuthProvider.GOOGLE, "google-12345"))
                .thenReturn(Optional.of(existing));

        AuthUserResponseDTO result = userService.findOrCreateOAuthUser(
                AuthProvider.GOOGLE, "john@example.com", "john_doe", "google-12345");

        assertNotNull(result);
        assertEquals(1L, result.userId());
        assertEquals("john_doe", result.username());
        assertEquals("USER", result.role());
        assertNull(result.password());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testFindOrCreateOAuthUser_ExistingUserByEmail_LinksProvider() {
        User existing = User.builder()
                .userId(2L)
                .username("jane_doe")
                .email("jane@example.com")
                .authProvider(AuthProvider.LOCAL)
                .providerId(null)
                .role(userRole)
                .build();

        when(userRepository.findByAuthProviderAndProviderId(AuthProvider.GITHUB, "github-999"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("jane@example.com"))
                .thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        AuthUserResponseDTO result = userService.findOrCreateOAuthUser(
                AuthProvider.GITHUB, "jane@example.com", "jane_github", "github-999");

        assertNotNull(result);
        assertEquals(2L, result.userId());
        assertEquals("jane_doe", result.username());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals(AuthProvider.GITHUB, saved.getAuthProvider());
        assertEquals("github-999", saved.getProviderId());
    }

    @Test
    void testFindOrCreateOAuthUser_NewUser_CreatesWithNullPasswordAndUserRole() {
        when(userRepository.findByAuthProviderAndProviderId(AuthProvider.GOOGLE, "google-new-id"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("newuser@example.com"))
                .thenReturn(Optional.empty());
        when(roleRepository.findByName(RoleType.USER))
                .thenReturn(Optional.of(userRole));
        when(userRepository.existsByUsername("alex")).thenReturn(false);

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setUserId(10L);
            return u;
        });

        AuthUserResponseDTO result = userService.findOrCreateOAuthUser(
                AuthProvider.GOOGLE, "newuser@example.com", "alex", "google-new-id");

        assertNotNull(result);
        assertEquals(10L, result.userId());
        assertEquals("alex", result.username());
        assertNull(result.password());
        assertEquals("USER", result.role());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("newuser@example.com", saved.getEmail());
        assertEquals(AuthProvider.GOOGLE, saved.getAuthProvider());
        assertEquals("google-new-id", saved.getProviderId());
        assertNull(saved.getPassword());
        assertEquals(userRole, saved.getRole());
    }

    @Test
    void testFindOrCreateOAuthUser_NewUser_UsernameCollisionResolved() {
        when(userRepository.findByAuthProviderAndProviderId(AuthProvider.GITHUB, "gh-456"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("col@example.com"))
                .thenReturn(Optional.empty());
        when(roleRepository.findByName(RoleType.USER))
                .thenReturn(Optional.of(userRole));

        when(userRepository.existsByUsername("col")).thenReturn(true);
        when(userRepository.existsByUsername("col1")).thenReturn(false);

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setUserId(20L);
            return u;
        });

        AuthUserResponseDTO result = userService.findOrCreateOAuthUser(
                AuthProvider.GITHUB, "col@example.com", "col", "gh-456");

        assertNotNull(result);
        assertEquals(20L, result.userId());
        assertEquals("col1", result.username());
    }
}
