package com.pnkj.Musy.history.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.user.entity.User;
import lombok.Getter;

import lombok.Setter;

@Entity
@Table(name = "play_history")
@Getter
@Setter
public class PlayHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long play_history_id;

    @ManyToOne
    @JoinColumn(name = "user_id")

    private User user;

    @ManyToOne
    @JoinColumn(name = "song_id")

    private Song song;

    @Column(name = "playedAt")
    private Instant playedAt;
}
