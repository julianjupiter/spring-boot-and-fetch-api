package io.github.julianjupiter.springbootandfetchapi.controller;

import io.github.julianjupiter.springbootandfetchapi.exception.ValidationException;
import io.github.julianjupiter.springbootandfetchapi.service.CategoryService;
import io.github.julianjupiter.springbootandfetchapi.domain.Category;
import io.github.julianjupiter.springbootandfetchapi.exception.ExceptionUtils;
import io.github.julianjupiter.springbootandfetchapi.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private MessageSource messageSource;

    @GetMapping
    public List<Category> findAll() {
        return categoryService.findAll();
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody Category category, BindingResult bindingResult) throws ValidationException {
        if (bindingResult.hasErrors()) {
            ExceptionUtils.invalid(bindingResult, messageSource, ExceptionUtils.path());
        }

        categoryService.save(category);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public Category findById(@PathVariable long id) throws ResourceNotFoundException {
        return categoryService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " was not found", ExceptionUtils.path(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable long id, @Valid @RequestBody Category book, BindingResult bindingResult) throws ValidationException, ResourceNotFoundException {
        if (bindingResult.hasErrors()) {
            ExceptionUtils.invalid(bindingResult, messageSource, ExceptionUtils.path());
        }

        return categoryService.findById(id)
                .map(foundBook -> {
                    categoryService.save(book);
                    return new ResponseEntity(HttpStatus.OK);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " was not found", ExceptionUtils.path(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Category> delete(@PathVariable long id) throws ResourceNotFoundException {
        return categoryService.findById(id)
                .map(category -> {
                    categoryService.delete(category);
                    return new ResponseEntity(HttpStatus.NO_CONTENT);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " was not found", ExceptionUtils.path(id)));
    }
}
