package io.github.julianjupiter.springbootandfetchapi.repository;

import io.github.julianjupiter.springbootandfetchapi.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
}
