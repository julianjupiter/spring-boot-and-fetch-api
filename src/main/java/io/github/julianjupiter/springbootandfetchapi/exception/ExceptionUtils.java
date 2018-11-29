package io.github.julianjupiter.springbootandfetchapi.exception;

import org.springframework.context.MessageSource;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

public class ExceptionUtils {
    public static void invalid(BindingResult bindingResult, MessageSource messageSource, String path) throws ValidationException {
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        List<ValidationError> validationErrors = fieldErrors.stream()
                .map(fieldError -> {
                    ValidationError validationError = new ValidationError();
                    validationError.setField(fieldError.getField());
                    String[] resolveMessageCodes = bindingResult.resolveMessageCodes(fieldError.getCode());
                    String string = resolveMessageCodes[0];
                    validationError.setMessage(messageSource.getMessage(string + "." + fieldError.getField(), new Object[]{fieldError.getRejectedValue()}, null));
                    return validationError;
                }).collect(Collectors.toList());
        throw new ValidationException("Validation errors", path, validationErrors);
    }

    public static String path() {
        return ServletUriComponentsBuilder.fromCurrentRequestUri()
                .buildAndExpand()
                .toUri()
                .getPath();
    }

    public static String path(Object... uriVariableValues) {
        return ServletUriComponentsBuilder.fromCurrentRequestUri()
                .buildAndExpand(uriVariableValues)
                .toUri()
                .getPath();
    }
}
