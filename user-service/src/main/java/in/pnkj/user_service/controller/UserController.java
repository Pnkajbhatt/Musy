package in.pnkj.user_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import in.pnkj.user_service.dto.ApiResponse;
import in.pnkj.user_service.dto.ApplicationReqDTO;
import in.pnkj.user_service.dto.ApplicationsResDTO;
import in.pnkj.user_service.dto.AuthUserResponseDTO;
import in.pnkj.user_service.dto.CreateUserRequestDTO;
import in.pnkj.user_service.dto.CreateUserResponseDTO;
import in.pnkj.user_service.dto.OAuthUserRequest;
import in.pnkj.user_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@RequestMapping("/api/users")
@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @PostMapping
    public CreateUserResponseDTO createUser(@Valid @RequestBody CreateUserRequestDTO request) {
        return userService.CreateUser(request);
    }

    @PostMapping(value = "/artist/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicationsResDTO>> applyForArtist(
            @RequestParam("artistName") String artistName,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "genre", required = false) String genre,
            @RequestPart(value = "file", required = false) MultipartFile profileImage,
            HttpServletRequest httpServletRequest) throws IOException {

        ApplicationReqDTO dto = new ApplicationReqDTO(artistName, bio, genre, profileImage);
        ApiResponse<ApplicationsResDTO> response = ApiResponse.Success(
                userService.PromoteAsArtist(dto, profileImage),
                "Application submitted successfully",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/artist/status")
    public ResponseEntity<ApiResponse<ApplicationsResDTO>> getMyApplicationStatus(
            HttpServletRequest httpServletRequest) {
        ApplicationsResDTO myApp = userService.getMyApplication();
        ApiResponse<ApplicationsResDTO> response = ApiResponse.Success(
                myApp,
                myApp != null ? "Application status fetched" : "No application found",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/oauth/find-or-create")
    public ResponseEntity<ApiResponse<AuthUserResponseDTO>> findOrCreateOAuthUser(
            @Valid @RequestBody OAuthUserRequest request,
            HttpServletRequest httpServletRequest) {
        AuthUserResponseDTO user = userService.findOrCreateOAuthUser(
                request.provider(),
                request.email(),
                request.username(),
                request.providerId()
        );
        ApiResponse<AuthUserResponseDTO> response = ApiResponse.Success(
                user,
                "OAuth user processed successfully",
                httpServletRequest.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
