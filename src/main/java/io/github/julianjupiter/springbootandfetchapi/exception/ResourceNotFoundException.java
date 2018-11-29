package io.github.julianjupiter.springbootandfetchapi.exception;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message, String path) {
        super(message, path);
    }
}
