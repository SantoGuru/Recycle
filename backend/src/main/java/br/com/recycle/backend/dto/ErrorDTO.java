package br.com.recycle.backend.dto;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ErrorDTO {
    private String timestamp;
    private int status;
    private String field;
    private String message;

    public ErrorDTO() {}

    public ErrorDTO(int status, String field, String message) {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        this.status = status;
        this.field = field;
        this.message = message;
    }

    // Getters e Setters
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getField() { return field; }
    public void setField(String field) { this.field = field; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}