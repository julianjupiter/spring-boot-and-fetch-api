package io.github.julianjupiter.springbootandfetchapi.service;

import io.github.julianjupiter.springbootandfetchapi.domain.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> findAll();
    Optional<Category> findById(long id);
    void save(Category category);
    void deleteById(long id);
    void delete(Category category);
}
