package io.github.julianjupiter.springbootandfetchapi.repository;

import io.github.julianjupiter.springbootandfetchapi.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
