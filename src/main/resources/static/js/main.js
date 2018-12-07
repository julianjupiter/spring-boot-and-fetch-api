let modal = $('#defaultModal');
let modalTitle = $('.modal-title');
let modalBody = $('.modal-body');
let modalFooter = $('.modal-footer');

let clearFormButton = $('<button type="reset" class="btn btn-secondary">Clear</button>');
let primaryButton = $('<button type="button" class="btn btn-primary"></button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');

$(document).ready(function(){
    viewAllBooks();
    viewAllCategories();
    defaultModal();
});

function defaultModal() {
    modal.modal({
            keyboard: true,
            backdrop: "static",
            show: false,
    }).on("show.bs.modal", function(event){
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let action = button.data('action');
        switch(action) {
            case 'viewBook':
                viewBook($(this), id);
                break;

            case 'addBook':
                addBook($(this));
                break;

            case 'editBook':
                editBook($(this), id);
                break;
        }
    }).on('hidden.bs.modal', function(event){
        $(this).find('.modal-title').html('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });
}

async function viewAllBooks() {
    $('#bookTable tbody').empty();
    const booksResponse = await bookService.findAll();
    const booksJson = booksResponse.json();
    booksJson.then(books => {
        books.forEach(book => {
            let bookRow = `$(<tr>
                        <th scope="row">${book.id}</th>
                        <td>${book.title}</td>
                        <td>${book.edition}</td>
                        <td>${book.author}</td>
                        <td>${book.category.name}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group" aria-label="Action Buttons">
                                <button class="btn btn-info btn-sm" data-id="${book.id}" data-action="viewBook" data-toggle="modal" data-target="#defaultModal"><i class="far fa-eye"></i></button>
                                <button class="btn btn-success btn-sm" data-id="${book.id}" data-action="editBook" data-toggle="modal" data-target="#defaultModal"><i class="far fa-edit"></i></button>
                            </div>
                        </td>
                    </tr>)`;
            $('#bookTable tbody').append(bookRow);
        });
    });
}

async function viewBook(modal, id) {
    const bookResponse = await bookService.findById(id);
    const bookJson = bookResponse.json();

    modal.find(modalTitle).html('View Book');
    let viewBookTableHidden = $('.viewBookTable:hidden')[0];
    modal.find(modalBody).html($(viewBookTableHidden).clone());
    let viewBookTable = modal.find('.viewBookTable');
    modal.find(viewBookTable).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);

    bookJson.then(book => {
        modal.find('#id').html(book.id);
        modal.find('#title').html(book.title);
        modal.find('#edition').html(book.edition);
        modal.find('#author').html(book.author);
        modal.find('#bookDescription').html(book.description);
        modal.find('#category').html(book.category.name);
    });
}

async function addBook(modal) {
    const categoriesResponse = await categoryService.findAll();
    const categoriesJson = categoriesResponse.json();

    modal.find(modalTitle).html('Add Book');
    let bookFormHidden = $('.bookForm:hidden')[0];
    modal.find(modalBody).html($(bookFormHidden).clone());
    let bookForm = modal.find('.bookForm');
    bookForm.prop('id', 'addBookForm');
    modal.find(bookForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'saveBookButton');
    primaryButton.html('Save');
    modal.find(modalFooter).append(primaryButton);
    categoriesJson.then(categories => {
        categories.forEach(category => {
            modal.find('#category').append(new Option(category.name, category.id));
        });
    });

    $('#saveBookButton').click(async function(e){
        let title = bookForm.find('#title').val().trim();
        let edition = bookForm.find('#edition').val().trim();
        let author = bookForm.find('#author').val().trim();
        let bookDescription = bookForm.find('#bookDescription').val().trim();
        let categoryId = bookForm.find('#category option:selected').val().trim();
        let data = {
            title: title,
            edition: edition,
            author: author,
            description: bookDescription,
            category: {
                id: categoryId
            }
        };

        const bookResponse = await bookService.add(data);

        if (bookResponse.status == 201) {
            viewAllBooks();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('Book added!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (bookResponse.status == 400) {
            bookResponse.json().then(response => {
                response.validationErrors.forEach(function(error){
                    modal.find('#' + error.field).addClass('is-invalid');
                    modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
                });
            });
        } else {
            bookResponse.json().then(response => {
                let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                        ${response.error}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                 modal.find('.modal-body').prepend(alert);
             });
        }
    });
}

async function editBook(modal, id) {
    const bookResponse = await bookService.findById(id);
    const bookJson = bookResponse.json();
    const categoriesResponse = await categoryService.findAll();
    const categoriesJson = categoriesResponse.json();

    let idInput = `<div class="form-group">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" disabled>
            <div class="invalid-feedback"></div>
        </div>`;

    modal.find(modalTitle).html('Edit Book');
    let bookFormHidden = $('.bookForm:hidden')[0];
    modal.find(modalBody).html($(bookFormHidden).clone());
    let bookForm = modal.find('.bookForm');
    bookForm.prop('id', 'updateBookForm');
    modal.find(bookForm).prepend(idInput);
    modal.find(bookForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'updateBookButton');
    primaryButton.html('Update');
    modal.find(modalFooter).append(primaryButton);

    bookJson.then(book => {
        modal.find('#id').val(book.id);
        modal.find('#title').val(book.title);
        modal.find('#edition').val(book.edition);
        modal.find('#author').val(book.author);
        modal.find('#bookDescription').val(book.description);
        categoriesJson.then(categories => {
            categories.forEach(category => {
                if (book.category.id == category.id)
                    modal.find('#category').append(new Option(category.name, category.id, false, true));
                else
                    modal.find('#category').append(new Option(category.name, category.id));
            });
        });
    });


    $('#updateBookButton').click(async function(e){
        let id = bookForm.find('#id').val().trim();
        let title = bookForm.find('#title').val().trim();
        let edition = bookForm.find('#edition').val().trim();
        let author = bookForm.find('#author').val().trim();
        let bookDescription = bookForm.find('#bookDescription').val().trim();
        let categoryId = bookForm.find('#category option:selected').val().trim();
        let data = {
            id: id,
            title: title,
            edition: edition,
            author: author,
            description: bookDescription,
            category: {
                id: categoryId
            }
        };

        const bookResponse = await bookService.update(id, data);

        if (bookResponse.status == 200) {
            viewAllBooks();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('Book updated!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (bookResponse.status == 400) {
            bookResponse.json().then(response => {
                response.validationErrors.forEach(function(error){
                    modal.find('#' + error.field).addClass('is-invalid');
                    modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
                });
            });
        } else {
            bookResponse.json().then(response => {
                let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                        ${response.error}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                 modal.find('.modal-body').prepend(alert);
             });
        }
    });
}

const http = {
    fetch: async function(url, options = {}) {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
        });

        return response;
    }
};

const bookService = {
    findAll: async () => {
        return await http.fetch('/api/books');
    },
    add: async (data) => {
        return await http.fetch('/api/books', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    findById: async (id) => {
        return await http.fetch('/api/books/' + id);
    },
    update: async (id, data) => {
        return await http.fetch('/api/books/' + id, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return await http.fetch('/api/books/' + id, {
            method: 'DELETE'
        });
    },
};

async function viewAllCategories() {
    $('#categoryTable tbody').empty();
    const categoriesResponse = await categoryService.findAll();
    const categoriesJson = categoriesResponse.json();
    categoriesJson.then(categories => {
        categories.forEach(category => {
            let categoryRow = `$(<tr>
                        <th scope="row">${category.id}</th>
                        <td>${category.name}</td>
                        <td>${category.description}</td>
                        <td>${category.createAt}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group" aria-label="Action Buttons">
                                <button class="btn btn-info btn-sm" data-id="${category.id}" data-action="viewCategory" data-toggle="modal" data-target="#defaultModal"><i class="far fa-eye"></i></button>
                                <button class="btn btn-success btn-sm" data-id="${category.id}" data-action="editCategory" data-toggle="modal" data-target="#defaultModal"><i class="far fa-edit"></i></button>
                            </div>
                        </td>
                    </tr>)`;
            $('#categoryTable tbody').append(categoryRow);
        });
    });
}

const categoryService = {
    findAll: async () => {
        return await http.fetch('/api/categories');
    },
    create: async (data) => {
        return await http.fetch('/api/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    findById: async (id) => {
        return await http.fetch('/api/categories/' + id);
    },
    update: async (id, data) => {
        return await http.fetch('/api/categories/' + id, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return await http.fetch('/api/categories/' + id, {
            method: 'DELETE'
        });
    },
};