package com.pnkj.Musy.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.user.dto.ApiResponse;
import com.pnkj.Musy.user.dto.UserResponse;

import com.pnkj.Musy.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @DeleteMapping("delete/user/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id, HttpServletRequest httpRequest) {

        String deleteUser = userService.deleteUser(id);

        ApiResponse<String> reponse = ApiResponse.Success(deleteUser, "User has been deleted",
                httpRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(reponse);

    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUser(HttpServletRequest httpRequest) {
        ApiResponse<List<UserResponse>> response = ApiResponse.Success(userService.getUsers(), "All the Users are ",
                httpRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.FOUND).body(response);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id, HttpServletRequest httpRequest) {
        ApiResponse<UserResponse> response = ApiResponse.Success(userService.getUsers(id), "User Found",
                httpRequest.getRequestURI());
        return ResponseEntity.status(HttpStatus.FOUND).body(response);
    }

}
