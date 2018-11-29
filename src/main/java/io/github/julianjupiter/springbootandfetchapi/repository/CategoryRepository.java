package io.github.julianjupiter.springbootandfetchapi.repository;

import io.github.julianjupiter.springbootandfetchapi.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
