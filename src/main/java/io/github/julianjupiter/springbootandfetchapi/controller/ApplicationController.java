package io.github.julianjupiter.springbootandfetchapi.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.Date;

@Controller
@RequestMapping("/")
public class ApplicationController {
    @Value("${page.home}")
    private String homePage;
    @Value("${page.books}")
    private String booksPage;
    @Value("${page.categories}")
    private String categoriesPage;

    @GetMapping({"", "/", "/home"})
    public String index(Model model) {
        model.addAttribute("pageName", homePage);

        return "home";
    }

    @GetMapping("/books")
    public String books(Model model) {
        model.addAttribute("pageName", booksPage);

        return "books";
    }

    @GetMapping("/categories")
    public String categories(Model model) {
        model.addAttribute("pageName", categoriesPage);

        return "categories";
    }
}
