package in.pnkj.auth_service.apiClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import in.pnkj.auth_service.dto.CreateUserRequest;
import in.pnkj.auth_service.dto.UserResponseDTO;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    @PostMapping("/api/users")
    UserResponseDTO createUser(@RequestBody CreateUserRequest request);
}
