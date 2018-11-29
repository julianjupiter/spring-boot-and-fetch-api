debugger;
let modal = $('#defaultModal');
let modalTitle = $('.modal-title');
let modalBody = $('.modal-body');
let modalFooter = $('.modal-footer');

let clearFormButton = $('<button type="reset" class="btn btn-secondary">Clear</button>');
let primaryButton = $('<button type="button" class="btn btn-primary"></button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');

$(document).ready(function(){
    viewAllBooks();
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
    const books = await bookService.findAll();

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
}

async function viewBook(modal, id) {
    const book = await bookService.findById(id);

    modal.find(modalTitle).html('View Book');
    let viewBookTableHidden = $('.viewBookTable:hidden')[0];
    modal.find(modalBody).html($(viewBookTableHidden).clone());
    let viewBookTable = modal.find('.viewBookTable');
    modal.find(viewBookTable).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);

    modal.find('#id').html(book.id);
    modal.find('#title').html(book.title);
    modal.find('#edition').html(book.edition);
    modal.find('#author').html(book.author);
    modal.find('#description').html(book.description);
    modal.find('#category').html(book.category.name);
}

async function addBook(modal) {
    const categories = await categoryService.findAll();

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
    categories.forEach(category => {
        modal.find('#category').append(new Option(category.name, category.id));
    });

    $('#saveBookButton').click(async function(e){
        let title = bookForm.find('#title').val().trim();
        let edition = bookForm.find('#edition').val().trim();
        let author = bookForm.find('#author').val().trim();
        let description = bookForm.find('#description').val().trim();
        let categoryId = bookForm.find('#category option:selected').val().trim();
        let data = {
            title: title,
            edition: edition,
            author: author,
            description, description,
            category: {
                id: categoryId
            }
        };

        console.log(data);

        const response = await bookService.add(data);
        console.log(response);
        if (response.status == 200) {
            console.log(response);
            viewAllBooks();
            modal.modal('hide');
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('Successful update!');
            $('#defaultModal').modal('show');
        } else {
//            alert(response.errors[0].message);
            response.errors.forEach(function(error){
                modal.find('#' + error.field).addClass('is-invalid');
                modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
            });
        }
    });
}

async function editBook(modal, id) {
    const book = await bookService.findById(id);
    const categories = await categoryService.findAll();

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

    modal.find('#id').val(book.id);
    modal.find('#title').val(book.title);
    modal.find('#edition').val(book.edition);
    modal.find('#author').val(book.author);
    modal.find('#description').val(book.description);
    categories.forEach(category => {
        modal.find('#category').append(new Option(category.name, category.id));
    });
    modal.find('#category option[value=' + book.category.id + ']').prop('selected', true);

    $('#updateBookButton').click(async function(e){
        let id = bookForm.find('#id').val().trim();
        let title = bookForm.find('#title').val().trim();
        let edition = bookForm.find('#edition').val().trim();
        let author = bookForm.find('#author').val().trim();
        let description = bookForm.find('#description').val().trim();
        let categoryId = bookForm.find('#category option:selected').val().trim();
        let data = {
            id: id,
            title: title,
            edition: edition,
            author: author,
            description, description,
            category: {
                id: categoryId
            }
        };

        console.log(data);

        const response = await bookService.update(id, data);

        console.log(response);

        if (response != null) {
            viewAllBooks();
            modal.modal('hide');
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('Successful update!');
            $('#defaultModal').modal('show');
        }
    });
}

const http = {
    fetch: async function(url, options) {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
        });

//        return {status: response.status, data: response.json()};
        return response.json();
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