package io.github.julianjupiter.springbootandfetchapi.service;

import io.github.julianjupiter.springbootandfetchapi.domain.Book;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.Optional;

public interface BookService {
    List<Book> findAll();
    Optional<Book> findById(long id);
    void save(Book book);
    void patch(MultiValueMap<String, String> parameters);
    void deleteById(long id);
    void delete(Book book);
}
