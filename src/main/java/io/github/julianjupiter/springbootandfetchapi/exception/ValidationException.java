package io.github.julianjupiter.springbootandfetchapi.exception;

import java.util.List;

public class ValidationException extends ApiException {
    private List<ValidationError> validationErrors;

    public ValidationException(String message, String path, List<ValidationError> validationErrors) {
        super(message, path);
        this.validationErrors = validationErrors;
    }

    public List<ValidationError> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(List<ValidationError> validationErrors) {
        this.validationErrors = validationErrors;
    }
}
