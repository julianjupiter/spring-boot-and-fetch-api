CREATE TABLE IF NOT EXISTS category (
	id int(11) NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_employee PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS book (
    id int(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    edition VARCHAR(255) NULL,
    author VARCHAR(255) NULL,
    description TEXT NULL,
    category_id INT(11) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES category (id),
    CONSTRAINT pk_book PRIMARY KEY (id)
);