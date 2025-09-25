package br.com.recycle.backend.dto;

import org.springframework.http.HttpStatus;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

public class ApiErrorDTO {
    private String timestamp;
    private int status;
    private List<String> errors;
    private String message;

    public ApiErrorDTO(HttpStatus status, String message, List<String> errors) {
        this.message = message;
        this.errors = errors;
        this.status = status.value();
        this.timestamp = Timestamp.from(Instant.now()).toString();
    }

    public ApiErrorDTO(HttpStatus status, String message, String error) {
        this.message = message;
        this.errors = Collections.singletonList(error);
        this.status = status.value();
        this.timestamp = Timestamp.from(Instant.now()).toString();
    }
}
