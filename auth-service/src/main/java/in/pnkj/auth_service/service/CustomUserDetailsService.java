package in.pnkj.auth_service.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import feign.FeignException;
import in.pnkj.auth_service.apiClient.UserServiceClient;
import in.pnkj.auth_service.config.CustomUserDetails;
import in.pnkj.auth_service.dto.AuthUserDTO;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserServiceClient userServiceClient;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            AuthUserDTO user = userServiceClient.getUserByUsername(username);
            return new CustomUserDetails(user);
        } catch (FeignException.NotFound ex) {
            throw new UsernameNotFoundException("User not Found");
        }
    }
}
