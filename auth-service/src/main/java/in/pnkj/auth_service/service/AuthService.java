package in.pnkj.auth_service.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import in.pnkj.auth_service.apiClient.UserServiceClient;
import in.pnkj.auth_service.dto.CreateUserRequest;
import in.pnkj.auth_service.dto.LoginReqDTO;
import in.pnkj.auth_service.dto.LoginResDTO;
import in.pnkj.auth_service.dto.RegisterReqDTO;
import in.pnkj.auth_service.dto.RegisterResDTO;
import in.pnkj.auth_service.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserServiceClient userServiceClient;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public RegisterResDTO register(RegisterReqDTO req) {
        UserResponseDTO user = userServiceClient
                .createUser(new CreateUserRequest(req.username(), req.email(), req.password()));

        return new RegisterResDTO(user.userId(), user.username());
    }

    public LoginResDTO loginUser(LoginReqDTO loginReqDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginReqDTO.username(), loginReqDTO.password()));
        return new LoginResDTO(jwtService.GenerateJwtToken(authentication), authentication.getName(),
                "User have been Login");
    }
}
