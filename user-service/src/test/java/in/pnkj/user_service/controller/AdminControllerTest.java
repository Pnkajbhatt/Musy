package in.pnkj.user_service.controller;

import in.pnkj.user_service.dto.ApiResponse;
import in.pnkj.user_service.dto.ApplicationsResDTO;
import in.pnkj.user_service.dto.UserSummaryDTO;
import in.pnkj.user_service.entity.ApplicationStatus;
import in.pnkj.user_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private AdminController adminController;

    @Test
    void testGetAllUsers() {
        when(request.getRequestURI()).thenReturn("/api/Admin/users");
        UserSummaryDTO userDto = new UserSummaryDTO(1L, "admin", "admin@musy.com", "ADMIN", Instant.now());
        when(userService.getAllUsers()).thenReturn(List.of(userDto));

        ResponseEntity<ApiResponse<List<UserSummaryDTO>>> response = adminController.getAllUsers(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().success());
        assertEquals(1, response.getBody().data().size());
        assertEquals("admin", response.getBody().data().get(0).username());
    }

    @Test
    void testGetAllApplications() {
        when(request.getRequestURI()).thenReturn("/api/Admin/artist/applications");
        ApplicationsResDTO appDto = new ApplicationsResDTO(
                10L, "artist1", 2L, "Bio test", "Rock", "http://image.url", "Cool Artist", ApplicationStatus.PENDING, LocalDateTime.now()
        );
        when(userService.getALLApplication()).thenReturn(List.of(appDto));

        ResponseEntity<ApiResponse<List<ApplicationsResDTO>>> response = adminController.getAllApplications(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().success());
        assertEquals(1, response.getBody().data().size());
        assertEquals(10L, response.getBody().data().get(0).applicationID());
    }
}
