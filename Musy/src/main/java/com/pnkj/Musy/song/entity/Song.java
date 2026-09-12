package com.pnkj.Musy.song.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.pnkj.Musy.user.entity.User;
import lombok.Getter;

import lombok.Setter;

@Entity
@Table(name = "Songs")
@Getter
@Setter
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long SongId;

    @NotBlank
    @Column(name = "title", unique = true)
    private String title;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @NotBlank
    private String songUrl;

    @NotBlank
    private String coverUrl;

    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Genre genre;

    @Column(name = "stream_count")
    private Long streamCount = 0L;

    @Column(name = "SongLike")
    private Long songLike = 0L;

    @Column(name = "createdAt")
    private Instant createdAt = Instant.now();
}
