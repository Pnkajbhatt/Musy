package in.pnkj.music_service.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import in.pnkj.music_service.apiClient.UserServiceClient;
import in.pnkj.music_service.dto.SongRequest;
import in.pnkj.music_service.dto.SongResponse;
import in.pnkj.music_service.dto.UserDataDTO;
import in.pnkj.music_service.entity.Song;
import in.pnkj.music_service.repo.SongRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository repository;
    private final UserServiceClient serviceClient;
    private final S3Service s3Service;

    public SongResponse createSong(SongRequest songRequest, String musicURL, String coverURL) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDataDTO user = serviceClient.getUserByUsername(authentication.getName());

        Song song = dtoTSong(songRequest, user.userId(), musicURL, coverURL);
        song = repository.save(song);

        return toResponse(song);
    }

    public void deleteSong(Long songId) {
        Song song = repository.findById(songId).orElseThrow(() -> new IllegalArgumentException("Song not found"));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDataDTO user = serviceClient.getUserByUsername(authentication.getName());
        if (!song.getUserId().equals(user.userId())) {
            throw new IllegalArgumentException("You are not authorized to delete this song");
        }

        s3Service.deleteFile(song.getSongUrl());
        s3Service.deleteFile(song.getCoverUrl());
        repository.delete(song);
    }

    public SongResponse findSong(Long songId) {
        return toResponse(
                repository.findById(songId).orElseThrow(() -> new IllegalArgumentException("Song not found")));
    }

    public List<SongResponse> allSongs() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    private SongResponse toResponse(Song song) {
        return SongResponse.from(song, s3Service.getFileUrl(song.getSongUrl()),
                s3Service.getFileUrl(song.getCoverUrl()));
    }

    public Song dtoTSong(SongRequest songRequest, Long user, String SongURL, String CoverURL) {

        Song song = new Song();
        song.setTitle(songRequest.title());
        song.setDescription(songRequest.description());
        song.setUserId(user);
        song.setCoverUrl(CoverURL);
        song.setGenre(songRequest.genre());
        song.setSongUrl(SongURL);
        return song;

    }
}
