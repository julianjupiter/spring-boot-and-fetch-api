package io.github.julianjupiter.springbootandfetchapi.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class BookSpecification implements Specification {
    @Override
    public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {

        return null;
    }

    @Override
    public Specification and(Specification other) {
        return null;
    }

    @Override
    public Specification or(Specification other) {
        return null;
    }
}
