package in.pnkj.history_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "play_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "song_id", nullable = false)
    private String songId;

    @Column(name = "played_at")
    private LocalDateTime playedAt;

    @PrePersist
    public void prePersist() {
        this.playedAt = LocalDateTime.now();
    }
}
