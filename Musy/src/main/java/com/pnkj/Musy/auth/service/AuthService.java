package com.pnkj.Musy.auth.service;

import org.apache.coyote.Response;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pnkj.Musy.auth.dto.RegisterReqDTO;
import com.pnkj.Musy.auth.dto.RegisterResDTO;
import com.pnkj.Musy.user.entity.Role;
import com.pnkj.Musy.user.entity.RoleType;
import com.pnkj.Musy.user.entity.User;
import com.pnkj.Musy.user.repository.RoleRepository;
import com.pnkj.Musy.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public RegisterResDTO RegisterUser(RegisterReqDTO req) {
        User user = new User();

        user.setEmail(req.email());
        user.setUsername(req.username());
        Role role = roleRepository.findByName(RoleType.USER)
                .orElseThrow(() -> new UsernameNotFoundException("Role Not found"));

        user.setRole(role);
        user.setPassword(passwordEncoder.encode(
                req.password()));

        User newUser = userRepository.save(user);
        return RegisterResDTO.fromEntity(newUser);
    }

}
