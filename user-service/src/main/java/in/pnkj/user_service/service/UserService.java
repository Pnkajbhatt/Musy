package in.pnkj.user_service.service;

import in.pnkj.user_service.repo.ArtistApplicationRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import in.pnkj.user_service.entity.ApplicationStatus;
import in.pnkj.user_service.entity.ArtistApplications;
import in.pnkj.user_service.entity.AuthProvider;
import in.pnkj.user_service.dto.AuthUserResponseDTO;
import in.pnkj.user_service.dto.CreateUserRequestDTO;
import in.pnkj.user_service.entity.Role;
import in.pnkj.user_service.entity.RoleType;
import in.pnkj.user_service.entity.User;
import in.pnkj.user_service.dto.ApplicationReqDTO;
import in.pnkj.user_service.dto.ApplicationsResDTO;
import in.pnkj.user_service.dto.CreateUserResponseDTO;
import in.pnkj.user_service.dto.UserRequest;
import in.pnkj.user_service.dto.UserResponse;
import in.pnkj.user_service.dto.UserSummaryDTO;
import in.pnkj.user_service.dto.ArtistDetailDTO;
import in.pnkj.user_service.dto.AdminStatsDTO;
import in.pnkj.user_service.exceptions.DuplicateResourceException;
import in.pnkj.user_service.exceptions.ResourceNotFoundException;
import in.pnkj.user_service.repo.RoleRepository;
import in.pnkj.user_service.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ArtistApplicationRepository artistApplicationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;

    public CreateUserResponseDTO CreateUser(CreateUserRequestDTO request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = new User();
        Role role = roleRepository.findByName(RoleType.USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role not Found"));

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setAuthProvider(AuthProvider.LOCAL);

        User savedUser = userRepository.save(user);

        return new CreateUserResponseDTO(savedUser.getUserId(), savedUser.getUsername());
    }

    public AuthUserResponseDTO getUserForAuth(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("user not Found"));
        return new AuthUserResponseDTO(user.getUserId(), user.getUsername(), user.getPassword(),
                user.getRole().getName().name());
    }

    public AuthUserResponseDTO getUserByIdForAuth(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user not Found with id: " + id));
        return new AuthUserResponseDTO(user.getUserId(), user.getUsername(), user.getPassword(),
                user.getRole().getName().name());
    }

    @Transactional
    public AuthUserResponseDTO findOrCreateOAuthUser(AuthProvider provider, String email, String username, String providerId) {
        // 1. Try to find by provider and providerId if available
        Optional<User> userOpt = Optional.empty();
        if (providerId != null && !providerId.isBlank()) {
            userOpt = userRepository.findByAuthProviderAndProviderId(provider, providerId);
        }

        // 2. Fall back to finding by email
        if (userOpt.isEmpty() && email != null && !email.isBlank()) {
            userOpt = userRepository.findByEmail(email);
        }

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            boolean updated = false;
            if (user.getProviderId() == null && providerId != null) {
                user.setProviderId(providerId);
                updated = true;
            }
            if (user.getAuthProvider() == null || (user.getAuthProvider() == AuthProvider.LOCAL && provider != AuthProvider.LOCAL)) {
                user.setAuthProvider(provider);
                updated = true;
            }
            if (updated) {
                user = userRepository.save(user);
            }
        } else {
            // 3. Create a new user
            Role role = roleRepository.findByName(RoleType.USER)
                    .orElseGet(() -> {
                        Role newRole = new Role(2L, RoleType.USER);
                        return roleRepository.save(newRole);
                    });

            String finalUsername = resolveUniqueUsername(username, email);

            User newUser = User.builder()
                    .email(email)
                    .username(finalUsername)
                    .authProvider(provider != null ? provider : AuthProvider.LOCAL)
                    .providerId(providerId)
                    .role(role)
                    .password(null)
                    .build();

            user = userRepository.save(newUser);
        }

        return new AuthUserResponseDTO(
                user.getUserId(),
                user.getUsername(),
                user.getPassword(),
                user.getRole() != null && user.getRole().getName() != null ? user.getRole().getName().name() : "USER"
        );
    }

    private String resolveUniqueUsername(String username, String email) {
        String baseName;
        if (username != null && !username.isBlank()) {
            baseName = username.trim().replaceAll("[^a-zA-Z0-9_.-]", "_");
        } else if (email != null && !email.isBlank()) {
            baseName = email.split("@")[0].replaceAll("[^a-zA-Z0-9_.-]", "_");
        } else {
            baseName = "user";
        }

        if (baseName.isBlank()) {
            baseName = "user";
        }

        String candidate = baseName;
        int count = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = baseName + count;
            count++;
        }
        return candidate;
    }

    public AuthUserResponseDTO getUserByProviderAndEmail(AuthProvider provider, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new AuthUserResponseDTO(
                user.getUserId(),
                user.getUsername(),
                user.getPassword(),
                user.getRole() != null && user.getRole().getName() != null ? user.getRole().getName().name() : "USER"
        );
    }

    public String deleteUser(Long id) {
        userRepository.deleteById(id);
        return "user has been deleted";
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(user -> userToDto(user)).toList();
    }

    public UserResponse getUsers(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("user Not Found"));
        return userToDto(user);
    }

    @Transactional
    public ApplicationsResDTO PromoteAsArtist(ApplicationReqDTO applicationReqDTO, MultipartFile profileImage)
            throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Check if user already has an application
        Optional<ArtistApplications> existingOpt = artistApplicationRepository.findTopByUserOrderByCreatedAtDesc(user);
        if (existingOpt.isPresent()) {
            ArtistApplications existing = existingOpt.get();
            if (existing.getApplicationStatus() == ApplicationStatus.PENDING) {
                return applicationsToDto(existing);
            }
        }

        MultipartFile imageToUpload = profileImage != null && !profileImage.isEmpty() ? profileImage : applicationReqDTO.ProfileImage();
        String profileImageUrl = imageToUpload != null && !imageToUpload.isEmpty()
                ? s3Service.uploadProfileImage(imageToUpload)
                : null;

        ArtistApplications applications = new ArtistApplications();
        applications.setUser(user);
        applications.setArtistName(applicationReqDTO.artistName());
        applications.setBio(applicationReqDTO.bio());
        applications.setGenre(applicationReqDTO.genre());
        applications.setProfileImage(profileImageUrl);
        applications.setApplicationStatus(ApplicationStatus.PENDING);
        applications.setCreatedAt(LocalDateTime.now());

        ArtistApplications savedApplication = artistApplicationRepository.save(applications);
        return applicationsToDto(savedApplication);
    }

    public ApplicationsResDTO getMyApplication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return null;
        }
        return artistApplicationRepository.findTopByUserOrderByCreatedAtDesc(user)
                .map(this::applicationsToDto)
                .orElse(null);
    }

    public List<ApplicationsResDTO> getALLApplication() {
        return artistApplicationRepository.findAll().stream()
                .map(this::applicationsToDto)
                .toList();
    }

    @Transactional
    public ApplicationsResDTO approveApplication(Long applicationId) {
        ArtistApplications application = artistApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        User user = application.getUser();
        Role artistRole = roleRepository.findByName(RoleType.ARTIST)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(RoleType.ARTIST);
                    return roleRepository.save(newRole);
                });

        user.setRole(artistRole);
        userRepository.save(user);

        application.setApplicationStatus(ApplicationStatus.APPROVED);
        ArtistApplications saved = artistApplicationRepository.save(application);
        return applicationsToDto(saved);
    }

    @Transactional
    public ApplicationsResDTO rejectApplication(Long applicationId) {
        ArtistApplications application = artistApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        application.setApplicationStatus(ApplicationStatus.REJECTED);
        ArtistApplications saved = artistApplicationRepository.save(application);
        return applicationsToDto(saved);
    }

    private ApplicationsResDTO applicationsToDto(ArtistApplications application) {
        User user = application.getUser();
        String imageUrl = application.getProfileImage();
        if (imageUrl != null && !imageUrl.isBlank() && !imageUrl.startsWith("http")) {
            imageUrl = s3Service.getFileUrl(imageUrl);
        }

        return new ApplicationsResDTO(
                application.getApplicationID(),
                user != null ? user.getUsername() : null,
                user != null ? user.getUserId() : null,
                application.getBio(),
                application.getGenre(),
                imageUrl,
                application.getArtistName(),
                application.getApplicationStatus(),
                application.getCreatedAt());
    }

    private User dtoToUser(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.username());
        user.setEmail(userRequest.email());
        user.setPassword(userRequest.password());
        return user;
    }

    private UserResponse userToDto(User user) {
        return new UserResponse(user.getUserId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    public List<UserSummaryDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummaryDTO(
                        u.getUserId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getRole() != null && u.getRole().getName() != null ? u.getRole().getName().name() : "USER",
                        u.getCreatedAt()))
                .toList();
    }

    public List<ArtistDetailDTO> getAllArtists() {
        List<User> artists = userRepository.findByRole_Name(RoleType.ARTIST);
        return artists.stream().map(artist -> {
            Optional<ArtistApplications> app = artistApplicationRepository.findTopByUserOrderByCreatedAtDesc(artist);
            String artistName = app.map(ArtistApplications::getArtistName).orElse(artist.getUsername());
            String bio = app.map(ArtistApplications::getBio).orElse(null);
            String genre = app.map(ArtistApplications::getGenre).orElse(null);
            String profileImage = app.map(ArtistApplications::getProfileImage).orElse(null);
            if (profileImage != null && !profileImage.isBlank() && !profileImage.startsWith("http")) {
                profileImage = s3Service.getFileUrl(profileImage);
            }
            return new ArtistDetailDTO(
                    artist.getUserId(),
                    artist.getUsername(),
                    artist.getEmail(),
                    artistName,
                    bio,
                    genre,
                    profileImage);
        }).toList();
    }

    public AdminStatsDTO getAdminStats() {
        long totalUsers = userRepository.count();
        long totalArtists = userRepository.countByRole_Name(RoleType.ARTIST);
        long totalListeners = userRepository.countByRole_Name(RoleType.USER);
        long pending = artistApplicationRepository.findByApplicationStatus(ApplicationStatus.PENDING).size();
        return new AdminStatsDTO(totalUsers, totalArtists, totalListeners, pending);
    }
}
