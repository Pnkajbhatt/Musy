package in.pnkj.user_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import in.pnkj.user_service.dto.CreateUserRequestDTO;
import in.pnkj.user_service.dto.CreateUserResponseDTO;

import in.pnkj.user_service.service.UserService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @PostMapping("/users")
    public CreateUserResponseDTO createUser(@Valid @RequestBody CreateUserRequestDTO request) {
        return userService.CreateUser(request);
    }

    // @DeleteMapping("delete/user/{id}")
    // public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id,
    // HttpServletRequest httpRequest) {

    // String deleteUser = userService.deleteUser(id);

    // ApiResponse<String> reponse = ApiResponse.Success(deleteUser, "User has been
    // deleted",
    // httpRequest.getRequestURI());

    // return ResponseEntity.status(HttpStatus.NO_CONTENT).body(reponse);

    // }

    // @GetMapping("/users")
    // public ResponseEntity<ApiResponse<List<UserResponse>>>
    // getAllUser(HttpServletRequest httpRequest) {
    // ApiResponse<List<UserResponse>> response =
    // ApiResponse.Success(userService.getUsers(), "All the Users are ",
    // httpRequest.getRequestURI());

    // return ResponseEntity.status(HttpStatus.FOUND).body(response);
    // }

    // @GetMapping("/user/{id}")
    // public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long
    // id, HttpServletRequest httpRequest) {
    // ApiResponse<UserResponse> response =
    // ApiResponse.Success(userService.getUsers(id), "User Found",
    // httpRequest.getRequestURI());
    // return ResponseEntity.status(HttpStatus.FOUND).body(response);
    // }

}
