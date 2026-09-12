package com.pnkj.Musy.history.controller;

import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.history.entity.PlayHistory;
import com.pnkj.Musy.history.service.HistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/song")
public class HistoryController {
    private final HistoryService historyService;

    @PostMapping("/history")
    public ResponseEntity<String> setHistory(Long songID) throws NotFoundException {
        historyService.setHistory(songID);
        return ResponseEntity.ok("save in History");
    }

    @GetMapping("/history")
    public ResponseEntity<List<PlayHistory>> GetAllHistory(Long userId) throws IllegalArgumentException {
        return ResponseEntity.ok(historyService.getAllHistory(userId));
    }

}
