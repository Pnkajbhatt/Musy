package com.pnkj.Musy.user.service;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pnkj.Musy.song.service.S3Service;
import com.pnkj.Musy.user.dto.ApplicationReqDTO;
import com.pnkj.Musy.user.dto.ApplicationsResDTO;
import com.pnkj.Musy.user.dto.UserRequest;
import com.pnkj.Musy.user.dto.UserResponse;
import com.pnkj.Musy.user.entity.ApplicationStatus;
import com.pnkj.Musy.user.entity.ArtistApplications;
import com.pnkj.Musy.user.entity.User;
import com.pnkj.Musy.user.repository.ArtistApplicationRepository;
import com.pnkj.Musy.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final ArtistApplicationRepository applicationRepository;

    public UserResponse saveUser(UserRequest userRequest) {
        User user = dtoToUser(userRequest);
        User createdUser = userRepository.save(user);
        UserResponse response = userToDto(createdUser);
        return response;
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
        UserResponse userResponse = userToDto(user);

        return userResponse;
    }

    public ApplicationsResDTO PromoteAsArtist(ApplicationReqDTO applicationReqDTO, MultipartFile profileImage)
            throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String profileImageUrl = s3Service.uploadProfileImage(profileImage);

        ArtistApplications applications = dtoToApplication(applicationReqDTO, profileImageUrl, user);

        ArtistApplications savedApplication = applicationRepository.save(applications);
        return applicationsToDto(savedApplication);

    }

    public List<ApplicationsResDTO> getALLApplication() {
        return applicationRepository.findAll().stream().map(application -> applicationsToDto(application)).toList();
    }

    private ApplicationsResDTO applicationsToDto(ArtistApplications application) {
        User user = application.getUser();

        return new ApplicationsResDTO(
                application.getApplicationID(),
                user.getUsername(),
                user.getUser_id(),
                application.getBio(),
                application.getGenre(),
                s3Service.getFileUrl(application.getProfileImage()),
                application.getArtistName(),
                application.getApplicationStatus(),
                application.getCreatedAt());

    }

    private ArtistApplications dtoToApplication(ApplicationReqDTO applicationReqDTO, String profileUrl, User user) {
        ArtistApplications applications = new ArtistApplications();

        applications.setUser(user);
        applications.setArtistName(applicationReqDTO.artistName());
        applications.setBio(applicationReqDTO.bio());
        applications.setApplicationStatus(ApplicationStatus.PENDING);
        applications.setGenre(applicationReqDTO.genre());
        applications.setProfileImage(profileUrl);
        return applications;

    }

    private User dtoToUser(UserRequest userRequest) {
        User user = new User();

        user.setUsername(userRequest.username());
        user.setEmail(userRequest.email());
        user.setPassword(userRequest.password());
        return user;

    }

    private UserResponse userToDto(User user) {
        UserResponse userResponse = new UserResponse(
                user.getUser_id(),
                user.getUsername(),
                user.getEmail(),
                user.getRole());

        return userResponse;

    }
}