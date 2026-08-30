package com.pnkj.Musy.song.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pnkj.Musy.song.entity.Song;

public interface SongRepository extends JpaRepository<Song, Long> {
}
