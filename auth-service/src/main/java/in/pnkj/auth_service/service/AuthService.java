package in.pnkj.auth_service.service;

import org.springframework.stereotype.Service;

import in.pnkj.auth_service.apiClient.UserServiceClient;
import in.pnkj.auth_service.dto.CreateUserRequest;
import in.pnkj.auth_service.dto.RegisterReqDTO;
import in.pnkj.auth_service.dto.RegisterResDTO;
import in.pnkj.auth_service.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserServiceClient userServiceClient;

    public RegisterResDTO register(RegisterReqDTO req) {
        UserResponseDTO user = userServiceClient
                .createUser(new CreateUserRequest(req.username(), req.email(), req.password()));

        return new RegisterResDTO(user.userId(), user.username());
    }
}
