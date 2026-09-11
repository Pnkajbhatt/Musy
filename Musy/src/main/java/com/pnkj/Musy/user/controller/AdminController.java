package com.pnkj.Musy.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pnkj.Musy.user.dto.ApiResponse;
import com.pnkj.Musy.user.dto.ApplicationReqDTO;
import com.pnkj.Musy.user.dto.ApplicationsResDTO;
import com.pnkj.Musy.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RequestMapping("/api/Admin")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    private final UserService userService;

    @PostMapping(value = "/artist/applicationsRequest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicationsResDTO>> ArtistApplications(
            @Valid @RequestParam("Application") ApplicationReqDTO applicationReqDTO,
            @RequestPart("file") MultipartFile profileImag, HttpServletRequest httpServletRequest) throws IOException {

        ApiResponse<ApplicationsResDTO> response = ApiResponse.Success(
                userService.PromoteAsArtist(applicationReqDTO, profileImag),
                "application has been submited", httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/artist/applications")
    public ResponseEntity<ApiResponse<List<ApplicationsResDTO>>> getAllApplications(
            HttpServletRequest httpServletRequest) {
        ApiResponse<List<ApplicationsResDTO>> response = ApiResponse.Success(userService.getALLApplication(),
                "all the Applications ", httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

}
