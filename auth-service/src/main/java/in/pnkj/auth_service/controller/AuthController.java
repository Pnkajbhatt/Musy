package in.pnkj.auth_service.controller;

import org.springframework.web.bind.annotation.RestController;

import in.pnkj.auth_service.dto.ApiResponseAuth;
import in.pnkj.auth_service.dto.RegisterReqDTO;
import in.pnkj.auth_service.dto.RegisterResDTO;
import in.pnkj.auth_service.service.AuthService;
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
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseAuth<RegisterResDTO>> registeration(@Valid @RequestBody RegisterReqDTO registerDTO,
            HttpServletRequest httpRequest) {
        ApiResponseAuth<RegisterResDTO> response = ApiResponseAuth.Success(authService.register(registerDTO),
                "User has been created", httpRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // @PostMapping("/login")
    // public ResponseEntity<ApiResponseAuth<LoginResDTO>> login(@Valid @RequestBody
    // LoginReqDTO loginReqDTO,
    // HttpServletRequest httpRequest) {
    // ApiResponseAuth<LoginResDTO> response =
    // ApiResponseAuth.Success(authService.loginUser(loginReqDTO),
    // "your Data for the user " + loginReqDTO.username(),
    // httpRequest.getRequestURI());

    // return ResponseEntity.status(HttpStatus.OK).body(response);
    // }

}
