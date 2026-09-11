package com.pnkj.Musy.user.entity;

import java.time.LocalDateTime;

import com.pnkj.Musy.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "ArtistApplications")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArtistApplications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ApplicationID;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String artistName;

    private String bio;

    private String genre;

    private String profileImage;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;

    private LocalDateTime createdAt;

}
