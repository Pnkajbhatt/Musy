package com.pnkj.Musy.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.user.dto.UserRequest;
import com.pnkj.Musy.user.dto.UserResponse;

import com.pnkj.Musy.user.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    // @PostMapping("/post")
    // public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
    // try {
    // User createdUser = userService.saveUser(user);
    // return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    // } catch (IllegalArgumentException e) {
    // log.error("Validation error: {}", e.getMessage());
    // return ResponseEntity.badRequest().body(null); // Or return a custom error
    // DTO
    // } catch (Exception e) {
    // log.error("Unexpected error while creating user: {}", e.getMessage());
    // return ResponseEntity.internalServerError().build();
    // }
    // }

    @PostMapping("user")
    public ResponseEntity<UserResponse> CreateUser(@Valid @RequestBody UserRequest user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveUser(user));
    }

    @DeleteMapping("delete/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String response = userService.deleteUser(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/users")
    public List<UserResponse> getAll() {
        return userService.getUsers();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.getUsers(id));
    }

}
