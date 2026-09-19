package in.pnkj.music_service.apiClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import in.pnkj.music_service.dto.UserDataDTO;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/internal/users/{username}")
    UserDataDTO getUserByUsername(@PathVariable("username") String username);
}
