package io.github.julianjupiter.springbootandfetchapi.controller;

import io.github.julianjupiter.springbootandfetchapi.domain.Book;
import io.github.julianjupiter.springbootandfetchapi.exception.ValidationException;
import io.github.julianjupiter.springbootandfetchapi.service.BookService;
import io.github.julianjupiter.springbootandfetchapi.service.CategoryService;
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
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private MessageSource messageSource;

    @GetMapping
    public List<Book> findAll() {
        return bookService.findAll();
    }

    @PostMapping
    public ResponseEntity<Book> create(@Valid @RequestBody Book book, BindingResult bindingResult) throws ValidationException {
        if (bindingResult.hasErrors()) {
            ExceptionUtils.invalid(bindingResult, messageSource, ExceptionUtils.path());
        }

        bookService.save(book);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public Book findById(@PathVariable long id) throws ResourceNotFoundException {
        return bookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book with ID " + id + " was not found", ExceptionUtils.path(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable long id, @Valid @RequestBody Book book, BindingResult bindingResult) throws ValidationException, ResourceNotFoundException {
        if (bindingResult.hasErrors()) {
            ExceptionUtils.invalid(bindingResult, messageSource, ExceptionUtils.path());
        }

        return bookService.findById(id)
                .map(foundBook -> {
                    bookService.save(book);
                    return new ResponseEntity(HttpStatus.OK);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Book with ID " + id + " was not found", ExceptionUtils.path(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Book> delete(@PathVariable long id) throws ResourceNotFoundException {
        return bookService.findById(id)
                .map(book -> {
                    bookService.delete(book);
                    return new ResponseEntity(HttpStatus.NO_CONTENT);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Book with ID " + id + " was not found", ExceptionUtils.path(id)));
    }
}
