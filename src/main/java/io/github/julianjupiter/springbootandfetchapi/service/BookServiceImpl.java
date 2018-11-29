package io.github.julianjupiter.springbootandfetchapi.service;

import io.github.julianjupiter.springbootandfetchapi.domain.Book;
import io.github.julianjupiter.springbootandfetchapi.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Optional<Book> findById(long id) {
        return bookRepository.findById(id);
    }

    @Override
    public void save(Book book) {
        bookRepository.save(book);
    }

    @Override
    public void patch(MultiValueMap<String, String> parameters) {
        String whereClause = parameters.keySet().stream()
                .map(key -> key + " = " + parameters.getFirst(key))
                .collect(Collectors.joining(" AND "));
    }

    @Override
    public void deleteById(long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public void delete(Book book) {
        bookRepository.delete(book);
    }


}
