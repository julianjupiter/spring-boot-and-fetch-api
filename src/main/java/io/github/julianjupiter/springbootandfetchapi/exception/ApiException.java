package io.github.julianjupiter.springbootandfetchapi.exception;

public class ApiException extends Exception {
    private String message;
    private String path;

    public ApiException() {
        super();
    }

    public ApiException(String message, String path) {
        super();
        this.message = message;
        this.path = path;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
