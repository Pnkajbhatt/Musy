package in.pnkj.user_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import in.pnkj.user_service.dto.ApiResponse;
import in.pnkj.user_service.dto.ApplicationReqDTO;
import in.pnkj.user_service.dto.ApplicationsResDTO;
import in.pnkj.user_service.dto.AdminStatsDTO;
import in.pnkj.user_service.dto.ArtistDetailDTO;
import in.pnkj.user_service.dto.UserSummaryDTO;
import in.pnkj.user_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RequestMapping({"/api/Admin", "/api/admin"})
@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    private final UserService userService;

    @PostMapping(value = "/artist/applicationsRequest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicationsResDTO>> artistApplications(
            @RequestParam("artistName") String artistName,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "genre", required = false) String genre,
            @RequestPart(value = "file", required = false) MultipartFile profileImage,
            HttpServletRequest httpServletRequest) throws IOException {

        ApplicationReqDTO dto = new ApplicationReqDTO(artistName, bio, genre, profileImage);
        ApiResponse<ApplicationsResDTO> response = ApiResponse.Success(
                userService.PromoteAsArtist(dto, profileImage),
                "Application has been submitted",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/artist/applications")
    public ResponseEntity<ApiResponse<List<ApplicationsResDTO>>> getAllApplications(
            HttpServletRequest httpServletRequest) {
        ApiResponse<List<ApplicationsResDTO>> response = ApiResponse.Success(
                userService.getALLApplication(),
                "All artist applications",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @RequestMapping(value = "/artist/applications/{id}/approve", method = {org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT})
    public ResponseEntity<ApiResponse<ApplicationsResDTO>> approveApplication(
            @PathVariable("id") Long id,
            HttpServletRequest httpServletRequest) {
        ApiResponse<ApplicationsResDTO> response = ApiResponse.Success(
                userService.approveApplication(id),
                "Application approved and user promoted to artist",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @RequestMapping(value = "/artist/applications/{id}/reject", method = {org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT})
    public ResponseEntity<ApiResponse<ApplicationsResDTO>> rejectApplication(
            @PathVariable("id") Long id,
            HttpServletRequest httpServletRequest) {
        ApiResponse<ApplicationsResDTO> response = ApiResponse.Success(
                userService.rejectApplication(id),
                "Application rejected",
                httpServletRequest.getRequestURI());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDTO>> getAdminStats(HttpServletRequest request) {
        ApiResponse<AdminStatsDTO> response = ApiResponse.Success(
                userService.getAdminStats(),
                "Admin statistics",
                request.getRequestURI());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserSummaryDTO>>> getAllUsers(HttpServletRequest request) {
        ApiResponse<List<UserSummaryDTO>> response = ApiResponse.Success(
                userService.getAllUsers(),
                "All registered users",
                request.getRequestURI());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/artists")
    public ResponseEntity<ApiResponse<List<ArtistDetailDTO>>> getAllArtists(HttpServletRequest request) {
        ApiResponse<List<ArtistDetailDTO>> response = ApiResponse.Success(
                userService.getAllArtists(),
                "All registered artists",
                request.getRequestURI());
        return ResponseEntity.ok(response);
    }
}
