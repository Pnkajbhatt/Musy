package com.pnkj.Musy.like.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pnkj.Musy.like.entity.Like;
import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.user.entity.User;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndSong(User user, Song song);

    long countBySong(Song song);

}
