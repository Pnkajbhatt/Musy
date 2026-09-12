package com.pnkj.Musy.like.service;

import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pnkj.Musy.like.entity.Like;
import com.pnkj.Musy.like.repository.LikeRepository;
import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.song.repository.SongRepository;
import com.pnkj.Musy.user.entity.User;
import com.pnkj.Musy.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepo;
    private final UserRepository userRepository;
    private final SongRepository songRepository;

    public String liked(Long SongId) throws NotFoundException {

        Song song = songRepository.findById(SongId).orElseThrow(() -> new NotFoundException());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        userRepository.findByUsername(username);
        User user = userRepository.findByUsername(username).orElseThrow(NotFoundException::new);

        Optional<Like> existingLike = likeRepo.findByUserAndSong(user, song);

        if (existingLike.isPresent()) {
            return "Already Liked";
        }

        Like like = new Like();
        like.setSong(song);
        like.setUser(user);

        likeRepo.save(like);

        song.setSongLike(song.getSongLike() + 1);
        songRepository.save(song);

        return "liked" + song.getTitle();
    }

    public String unlike(Long songId) throws NotFoundException {
        Song song = songRepository.findById(songId).orElseThrow(NotFoundException::new);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(NotFoundException::new);

        Optional<Like> existingLike = likeRepo.findByUserAndSong(user, song);
        if (existingLike.isEmpty()) {
            return "Not liked";
        }
        likeRepo.delete(existingLike.get());

        song.setSongLike(song.getSongLike() - 1);
        songRepository.save(song);
        return "unliked";
    }

    public Long getLikes(Long songId) throws NotFoundException {

        Song song = songRepository.findById(songId)
                .orElseThrow(NotFoundException::new);

        return song.getSongLike();
    }
}
