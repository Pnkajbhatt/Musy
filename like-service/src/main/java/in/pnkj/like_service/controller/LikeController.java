package in.pnkj.like_service.controller;

import in.pnkj.like_service.dto.LikeResponse;
import in.pnkj.like_service.service.LikeService;
import in.pnkj.like_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final JwtUtil jwtUtil;

    /** Like a song. Returns 201 Created with the new Like record. */
    @PostMapping("/{songId}")
    public ResponseEntity<LikeResponse> likeSong(
            @PathVariable String songId,
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(likeService.likeSong(userId, songId));
    }

    /** Unlike a song. Returns 204 No Content. */
    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> unlikeSong(
            @PathVariable String songId,
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        likeService.unlikeSong(userId, songId);
        return ResponseEntity.noContent().build();
    }

    /** Get all liked songs for the authenticated user. */
    @GetMapping
    public ResponseEntity<List<LikeResponse>> getLikedSongs(
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        return ResponseEntity.ok(likeService.getLikedSongs(userId));
    }

    /** Check whether the authenticated user has liked a specific song. */
    @GetMapping("/{songId}/status")
    public ResponseEntity<Map<String, Boolean>> isLiked(
            @PathVariable String songId,
            @RequestHeader("Authorization") String auth) {
        Long userId = jwtUtil.extractUserId(auth);
        return ResponseEntity.ok(Map.of("liked", likeService.isLiked(userId, songId)));
    }

    /** Public endpoint – returns total like count for a song. */
    @GetMapping("/{songId}/count")
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable String songId) {
        return ResponseEntity.ok(Map.of("count", likeService.getLikeCount(songId)));
    }
}
