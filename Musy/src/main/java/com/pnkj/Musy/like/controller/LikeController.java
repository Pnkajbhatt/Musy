package com.pnkj.Musy.like.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.like.service.LikeService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/song")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{song_id}/like")
    public ResponseEntity<String> likedCount(@PathVariable Long song_id) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(likeService.liked(song_id));
    }

    @GetMapping("/{song_id}/like")
    public ResponseEntity<Long> GetlikedCount(@PathVariable Long song_id) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(likeService.getLikes(song_id));
    }

    @DeleteMapping("/{song_id}/like")
    public ResponseEntity<String> unlike(@PathVariable Long song_id) throws NotFoundException {
        return ResponseEntity.ok(likeService.unlike(song_id));
    }
}
