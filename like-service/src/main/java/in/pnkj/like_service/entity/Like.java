package in.pnkj.like_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "song_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "song_id", nullable = false)
    private String songId;

    @Column(name = "liked_at")
    private LocalDateTime likedAt;

    @PrePersist
    public void prePersist() {
        this.likedAt = LocalDateTime.now();
    }
}
