package in.pnkj.history_service.controller;

import in.pnkj.history_service.dto.HistoryResponse;
import in.pnkj.history_service.service.HistoryService;
import in.pnkj.history_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;
    private final JwtUtil jwtUtil;

    /**
     * Record that the authenticated user played a song.
     * Returns 201 Created with the new History record.
     */
    @PostMapping("/{songId}")
    public ResponseEntity<HistoryResponse> recordPlay(
            @PathVariable String songId,
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(historyService.recordPlay(userId, songId));
    }

    /**
     * Get the authenticated user's play history, sorted newest first.
     */
    @GetMapping
    public ResponseEntity<List<HistoryResponse>> getUserHistory(
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        return ResponseEntity.ok(historyService.getUserHistory(userId));
    }

    /**
     * Clear all play history for the authenticated user.
     * Returns 204 No Content.
     */
    @DeleteMapping
    public ResponseEntity<Void> clearHistory(
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        historyService.clearHistory(userId);
        return ResponseEntity.noContent().build();
    }
}
