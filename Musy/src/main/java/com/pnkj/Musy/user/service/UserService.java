package com.pnkj.Musy.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pnkj.Musy.user.dto.UserRequest;
import com.pnkj.Musy.user.dto.UserResponse;
import com.pnkj.Musy.user.entity.Role;
import com.pnkj.Musy.user.entity.User;
import com.pnkj.Musy.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse saveUser(UserRequest userRequest) {
        User user = dtoToUser(userRequest);
        User createdUser = userRepository.save(user);
        UserResponse response = userToDto(createdUser);
        return response;
    }

    public String deleteUser(Long id) {
        userRepository.deleteById(id);
        return "user has been deleted";
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(user -> userToDto(user)).toList();
    }

    public UserResponse getUsers(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("user Not Found"));
        UserResponse userResponse = userToDto(user);

        return userResponse;
    }

    private User dtoToUser(UserRequest userRequest) {
        User user = new User();

        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());
        user.setRole(Role.USER);

        return user;

    }

    private UserResponse userToDto(User user) {
        UserResponse userResponse = new UserResponse();

        userResponse.setId(user.getUser_id());
        userResponse.setEmail(user.getEmail());
        userResponse.setUsername(user.getUsername());
        userResponse.setRole(user.getRole());

        return userResponse;

    }
}