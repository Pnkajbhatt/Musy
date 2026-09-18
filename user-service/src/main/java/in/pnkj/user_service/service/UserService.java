package in.pnkj.user_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import in.pnkj.user_service.dto.CreateUserRequestDTO;
import in.pnkj.user_service.dto.CreateUserResponseDTO;
import in.pnkj.user_service.entity.Role;
import in.pnkj.user_service.entity.RoleType;
import in.pnkj.user_service.entity.User;
import in.pnkj.user_service.exceptions.DuplicateResourceException;
import in.pnkj.user_service.exceptions.ResourceNotFoundException;
import in.pnkj.user_service.repo.RoleRepository;
import in.pnkj.user_service.repo.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

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

        User savedUser = userRepository.save(user);

        return new CreateUserResponseDTO(savedUser.getUserId(), savedUser.getUsername());
    }

    // public String deleteUser(Long id) {
    // userRepository.deleteById(id);
    // return "user has been deleted";
    // }

    // public List<UserResponse> getUsers() {
    // return userRepository.findAll().stream().map(user ->
    // userToDto(user)).toList();
    // }

    // public UserResponse getUsers(Long id) {
    // User user = userRepository.findById(id).orElseThrow(() -> new
    // IllegalArgumentException("user Not Found"));
    // UserResponse userResponse = userToDto(user);

    // return userResponse;
    // }

    // public ApplicationsResDTO PromoteAsArtist(ApplicationReqDTO
    // applicationReqDTO, MultipartFile profileImage)
    // throws IOException {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // User user = userRepository.findByUsername(username).orElseThrow(() -> new
    // RuntimeException("User not found"));

    // String profileImageUrl = s3Service.uploadProfileImage(profileImage);

    // ArtistApplications applications = dtoToApplication(applicationReqDTO,
    // profileImageUrl, user);

    // ArtistApplications savedApplication =
    // applicationRepository.save(applications);
    // return applicationsToDto(savedApplication);

    // }

    // public List<ApplicationsResDTO> getALLApplication() {
    // return applicationRepository.findAll().stream().map(application ->
    // applicationsToDto(application)).toList();
    // }

    // private ApplicationsResDTO applicationsToDto(ArtistApplications application)
    // {
    // User user = application.getUser();

    // return new ApplicationsResDTO(application.getApplicationID(),
    // user.getUsername(), user.getUserId(),
    // application.getBio(), application.getGenre(),
    // s3Service.getFileUrl(application.getProfileImage()),
    // application.getArtistName(), application.getApplicationStatus(),
    // application.getCreatedAt());

    // }

    // private ArtistApplications dtoToApplication(ApplicationReqDTO
    // applicationReqDTO, String profileUrl, User user) {
    // ArtistApplications applications = new ArtistApplications();

    // applications.setUser(user);
    // applications.setArtistName(applicationReqDTO.artistName());
    // applications.setBio(applicationReqDTO.bio());
    // applications.setApplicationStatus(ApplicationStatus.PENDING);
    // applications.setGenre(applicationReqDTO.genre());
    // applications.setProfileImage(profileUrl);
    // return applications;

    // }

    // private User dtoToUser(UserRequest userRequest) {
    // User user = new User();

    // user.setUsername(userRequest.username());
    // user.setEmail(userRequest.email());
    // user.setPassword(userRequest.password());
    // return user;

    // }

    // private UserResponse userToDto(User user) {
    // UserResponse userResponse = new UserResponse(user.getUserId(),
    // user.getUsername(), user.getEmail(),
    // user.getRole());

    // return userResponse;

    // }

    // }

}