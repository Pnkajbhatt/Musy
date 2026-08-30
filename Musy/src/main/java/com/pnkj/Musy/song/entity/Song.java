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
    private Long Song_id;

    @NotBlank
    @Column(name = "title", unique = true)
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    private String song_url;

    @NotBlank
    private String cover_url;

    private String description;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Column(name = "stream_count")
    private Long stream_count;

    @Column(name = "createdAt")
    private Instant created_At = Instant.now();
}
