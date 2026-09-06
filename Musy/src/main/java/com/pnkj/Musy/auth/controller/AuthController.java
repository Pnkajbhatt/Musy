package com.pnkj.Musy.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.auth.dto.LoginReqDTO;
import com.pnkj.Musy.auth.dto.LoginResDTO;
import com.pnkj.Musy.auth.dto.RegisterReqDTO;
import com.pnkj.Musy.auth.dto.RegisterResDTO;
import com.pnkj.Musy.auth.service.AuthService;
import com.pnkj.Musy.user.dto.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResDTO>> registeration(@Valid @RequestBody RegisterReqDTO registerDTO,
            HttpServletRequest httpRequest) {
        ApiResponse<RegisterResDTO> response = ApiResponse.Success(authService.RegisterUser(registerDTO),
                "User has been created", httpRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResDTO>> login(@Valid @RequestBody LoginReqDTO loginReqDTO,
            HttpServletRequest httpRequest) {
        ApiResponse<LoginResDTO> response = ApiResponse.Success(authService.loginUser(loginReqDTO),
                "your Data for the user " + loginReqDTO.username(), httpRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
