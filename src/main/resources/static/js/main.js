let modal = $('#defaultModal');
let modalTitle = $('.modal-title');
let modalBody = $('.modal-body');
let modalFooter = $('.modal-footer');

let clearFormButton = $('<button type="reset" class="btn btn-secondary">Clear</button>');
let primaryButton = $('<button type="button" class="btn btn-primary"></button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');
let dangerButton = $('<button type="button" class="btn btn-danger"></button>');

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

            case 'deleteBook':
                deleteBook($(this), id);
                break;

            case 'viewCategory':
                viewCategory($(this), id);
                break;

            case 'addCategory':
                addCategory($(this));
                break;

            case 'editCategory':
                editCategory($(this), id);
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
                                <button class="btn btn-danger btn-sm" data-id="${book.id}" data-action="deleteBook" data-toggle="modal" data-target="#defaultModal"><i class="far fa-trash-alt"></i></button>
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

async function deleteBook(modal, id) {
    const bookResponse = await bookService.findById(id);
    const bookJson = bookResponse.json();

    modal.find(modalTitle).html('Delete Book');
    let message = '<strong>Are you sure to delete the following book?</strong>';
    modal.find(modalBody).html(message);
    let viewBookTableHidden = $('.viewBookTable:hidden')[0];
    modal.find(modalBody).append($(viewBookTableHidden).clone());
    let viewBookTable = modal.find('.viewBookTable');
    modal.find(viewBookTable).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);
    dangerButton.prop('id', 'deleteBookButton');
    dangerButton.html('Delete');
    modal.find(modalFooter).append(dangerButton);

    bookJson.then(book => {
        modal.find('#id').html(book.id);
        modal.find('#title').html(book.title);
        modal.find('#edition').html(book.edition);
        modal.find('#author').html(book.author);
        modal.find('#bookDescription').html(book.description);
        modal.find('#category').html(book.category.name);
    });

    $('#deleteBookButton').click(async function(e){
            const bookResponse = await bookService.delete(id);

            if (bookResponse.status == 204) {
                viewAllBooks();
                modal.find('.modal-title').html('Success');
                modal.find('.modal-body').html('Book deleted!');
                dismissButton.html('Close');
                modal.find(modalFooter).html(dismissButton);
                $('#defaultModal').modal('show');
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

async function viewAllCategories() {
    $('#categoryTable tbody').empty();
    const categoriesResponse = await categoryService.findAll();
    const categoriesJson = categoriesResponse.json();
    categoriesJson.then(categories => {
        categories.forEach(category => {
        console.log(category.description);
            let categoryRow = `$(<tr>
                        <th scope="row">${category.id}</th>
                        <td>${category.name}</td>
                        <td>${new Date(category.createdAt).toLocaleString()}</td>
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

async function viewCategory(modal, id) {
    const categoryResponse = await categoryService.findById(id);
    const categoryJson = categoryResponse.json();

    modal.find(modalTitle).html('View Category');
    let viewCategoryTableHidden = $('.viewCategoryTable:hidden')[0];
    modal.find(modalBody).html($(viewCategoryTableHidden).clone());
    let viewCategoryTable = modal.find('.viewCategoryTable');
    modal.find(viewCategoryTable).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);

    categoryJson.then(category => {
        modal.find('#id').html(category.id);
        modal.find('#name').html(category.name);
        modal.find('#description').html(category.description);
        modal.find('#createdAt').html(new Date(category.createdAt).toLocaleString());
    });
}

async function addCategory(modal) {
    modal.find(modalTitle).html('Add Category');
    let categoryFormHidden = $('.categoryForm:hidden')[0];
    modal.find(modalBody).html($(categoryFormHidden).clone());
    let categoryForm = modal.find('.categoryForm');
    categoryForm.prop('id', 'addCategoryForm');
    modal.find(categoryForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'saveCategoryButton');
    primaryButton.html('Save');
    modal.find(modalFooter).append(primaryButton);

    $('#saveCategoryButton').click(async function(e){
        let name = categoryForm.find('#name').val().trim();
        let categoryDescription = categoryForm.find('#categoryDescription').val().trim();
        let data = {
            name: name,
            description: categoryDescription
        };

        const categoryResponse = await categoryService.add(data);

        if (categoryResponse.status == 201) {
            viewAllCategories();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('Category added!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (categoryResponse.status == 400) {
            categoryResponse.json().then(response => {
                response.validationErrors.forEach(function(error){
                    modal.find('#' + error.field).addClass('is-invalid');
                    modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
                });
            });
        } else {
            categoryResponse.json().then(response => {
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">
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

async function editCategory(modal, id) {
    const categoryResponse = await categoryService.findById(id);
    const categoryJson = categoryResponse.json();

    let idInput = `<div class="form-group">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" disabled>
            <div class="invalid-feedback"></div>
        </div>`;

    modal.find(modalTitle).html('Edit Category');
    let categoryFormHidden = $('.categoryForm:hidden')[0];
    modal.find(modalBody).html($(categoryFormHidden).clone());
    let categoryForm = modal.find('.categoryForm');
    categoryForm.prop('id', 'updateCategoryForm');
    modal.find(categoryForm).prepend(idInput);
    modal.find(categoryForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'updateCategoryButton');
    primaryButton.html('Update');
    modal.find(modalFooter).append(primaryButton);

    categoryJson.then(category => {
        modal.find('#id').val(category.id);
        modal.find('#name').val(category.name);
        modal.find('#categoryDescription').val(category.description);
    });


    $('#updateCategoryButton').click(async function(e){
        let id = categoryForm.find('#id').val().trim();
        let name = categoryForm.find('#name').val().trim();
        let categoryDescription = categoryForm.find('#categoryDescription').val().trim();
        let data = {
            id: id,
            name: name,
            description: categoryDescription
        };

        const categoryResponse = await categoryService.update(id, data);

        if (categoryResponse.status == 200) {
            viewAllCategories();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('Category updated!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (categoryResponse.status == 400) {
            categoryResponse.json().then(response => {
                response.validationErrors.forEach(function(error){
                    modal.find('#' + error.field).addClass('is-invalid');
                    modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
                });
            });
        } else {
            categoryResponse.json().then(response => {
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">
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

const categoryService = {
    findAll: async () => {
        return await http.fetch('/api/categories');
    },
    add: async (data) => {
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
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return await http.fetch('/api/categories/' + id, {
            method: 'DELETE'
        });
    },
};