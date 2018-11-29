package io.github.julianjupiter.springbootandfetchapi.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.ZonedDateTime;
import java.util.List;

public class ApiErrorResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private ZonedDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<ValidationError> validationErrors;

    public ApiErrorResponse() {}

    public ApiErrorResponse(ZonedDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public List<ValidationError> getValidationErrors() {
        return validationErrors;
    }

    public ApiErrorResponse withValidationErrors(List<ValidationError> validationErrors) {
        this.validationErrors = validationErrors;

        return this;
    }
}
