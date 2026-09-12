package com.pnkj.Musy.history.service;

import com.pnkj.Musy.history.repository.PlayHistoryRepository;

import java.sql.Time;
import java.time.Instant;
import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pnkj.Musy.history.entity.PlayHistory;
import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.song.repository.SongRepository;
import com.pnkj.Musy.user.entity.User;
import com.pnkj.Musy.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final PlayHistoryRepository playHistoryRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;

    public void setHistory(Long songId) throws NotFoundException {
        Song song = songRepository.findById(songId).orElseThrow(() -> new NotFoundException());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        userRepository.findByUsername(username);
        User user = userRepository.findByUsername(username).orElseThrow(NotFoundException::new);

        PlayHistory playHistory = new PlayHistory();
        playHistory.setSong(song);
        playHistory.setUser(user);
        playHistory.setPlayedAt(Instant.now());

        song.setStreamCount(song.getStreamCount() + 1);

        playHistoryRepository.save(playHistory);

    }

    public List<PlayHistory> getAllHistory(Long userId) throws IllegalArgumentException {
        List<PlayHistory> histories = playHistoryRepository.findAllByUserUserId(userId);
        return histories;
    }
}
