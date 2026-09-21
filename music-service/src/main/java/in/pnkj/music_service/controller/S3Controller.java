package in.pnkj.music_service.controller;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import in.pnkj.music_service.service.S3Service;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class S3Controller {
        private final S3Service s3Services;

        @GetMapping("/play")
        public ResponseEntity<StreamingResponseBody> download(
                        @RequestParam String fileName,
                        @RequestHeader(value = HttpHeaders.RANGE, required = false) String rangeHeader) {
                try {
                        ResponseInputStream<GetObjectResponse> s3Stream = s3Services.downloadStream(fileName, rangeHeader);
                        GetObjectResponse s3Response = s3Stream.response();

                        String contentType = s3Response.contentType();
                        if (contentType == null || contentType.isBlank()
                                        || contentType.equalsIgnoreCase(MediaType.APPLICATION_OCTET_STREAM_VALUE)) {
                                contentType = MediaTypeFactory.getMediaType(fileName)
                                                .map(MediaType::toString)
                                                .orElse("audio/mpeg");
                        }

                        HttpStatus status = (rangeHeader != null && s3Response.contentRange() != null)
                                        ? HttpStatus.PARTIAL_CONTENT
                                        : HttpStatus.OK;

                        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.status(status)
                                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                                        .header(HttpHeaders.CONTENT_TYPE, contentType);

                        if (s3Response.contentLength() != null) {
                                responseBuilder.header(HttpHeaders.CONTENT_LENGTH, String.valueOf(s3Response.contentLength()));
                        }

                        if (s3Response.contentRange() != null) {
                                responseBuilder.header(HttpHeaders.CONTENT_RANGE, s3Response.contentRange());
                        }

                        StreamingResponseBody responseBody = outputStream -> {
                                try (s3Stream) {
                                        byte[] buffer = new byte[8192];
                                        int bytesRead;
                                        while ((bytesRead = s3Stream.read(buffer)) != -1) {
                                                outputStream.write(buffer, 0, bytesRead);
                                        }
                                        outputStream.flush();
                                } catch (IOException ignored) {
                                        // Client paused or stopped playback
                                }
                        };

                        return responseBuilder.body(responseBody);
                } catch (NoSuchKeyException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }
}
