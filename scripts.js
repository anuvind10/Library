class DOMCache {
    static elements = {
        booksGrid: document.querySelector('.books'),
        emptyLibMsg: document.querySelector('#emptyLibMsg'),
        newEntry: document.querySelector('#newEntry'),
        cancelBtn: document.querySelector('#cancelBtn'),
        addBtn: document.querySelector('#addBtn'),
        addBookForm: document.querySelector('#addBookForm'),
        addBookTab: document.querySelector('#addBookTab'),
        overlay: document.querySelector('#overlay'),
        titleInput: document.querySelector('#Title'),
        authorInput: document.querySelector('#Author'),
        pagesInput: document.querySelector('#Pages'),
        readCheckbox: document.querySelector('#readChk'),
        inputs: document.querySelectorAll('input')

    };

    static get(key) {
        return this.elements[key];
    }
}

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read ? "Read" : "Not Read";
    }

    toggleRead() {
        this.read = this.read === "Read" ? "Not Read" : "Read";
    }
}

class Library {
    constructor() {
        this.myLibrary = [];
    }

    addBook(book) {
        this.myLibrary.push(book);
        this.displayBooks();
    }

    deleteBook(event) {
        var bookID = event.target.id.split('-')[1];
        if (bookID) {
            this.myLibrary.splice(bookID, 1);
        }
        this.displayBooks();
    }

    toggleReadDisplay(event) {
        var bookID = event.target.getAttribute('data-read-id').split('-')[1];
        
        this.myLibrary[bookID].toggleRead();
        if (event.target.classList.contains('read')) {
            event.target.classList.remove('read');
            event.target.classList.add('notRead');
        }
        else {
            event.target.classList.remove('notRead');
            event.target.classList.add('read');
        }

        this.displayBooks();
    }

    // Delete button appears dynamically on each book
    toggleDelete(event) {
        var bookID = event.target.id.split('-')[1];
        const deleteID = 'deleteBtn-' + bookID;
        const deleteElem = document.getElementById(deleteID);
        const isActive = deleteElem.classList.contains('active');

        if(!isActive) {
            deleteElem.classList.add('active');
        }
        else {
            deleteElem.classList.remove('active');
        }
    }

    displayBooks() {
        const booksGrid = DOMCache.get('booksGrid');
        const emptyLibMsg = DOMCache.get('emptyLibMsg');
        booksGrid.innerHTML = '';

        this.myLibrary.forEach((book, i) => {
            const bookDiv = document.createElement('div');
            bookDiv.id = 'book-' + i;
            bookDiv.classList.add('book');
            bookDiv.innerHTML = `
                <p id="title-${i}" class="details"><span class="header">Title: </span>${book.title}</p>
                <p id="author-${i}" class="details"><span class="header">Author: </span>${book.author}</p>
                <p id="pages-${i}" class="details"><span class="header">No. of Pages: </span>${book.pages}</p>
                <button id="readBtn-${i}" class="readBtn details ${book.read === 'Read' ? 'read' : 'notRead'}" data-read-id='book-${i}'>${book.read}</button>
                <img id="deleteBtn-${i}" class="png deleteBtn" src="./icons/delete.png" alt="delete">
            `;
            booksGrid.appendChild(bookDiv);
        });

        emptyLibMsg.style.display = this.myLibrary.length ? 'none' : 'block';
        this.attachEventListeners();
    }

    attachEventListeners() {
        const books = document.querySelectorAll('.book');
        const readBtns = document.querySelectorAll('.readBtn');
        const deleteBtns = document.querySelectorAll('.deleteBtn');

        books.forEach(book => {
            book.addEventListener('mouseenter', (event) => this.toggleDelete(event));
            book.addEventListener('mouseleave', (event) => this.toggleDelete(event));
        });

        readBtns.forEach(button => {
            button.addEventListener('click', (event) => this.toggleReadDisplay(event));
        });

        deleteBtns.forEach(button => {
            button.addEventListener('click', (event) => this.deleteBook(event));
        });
    }
}

class UI {
    constructor(Library) {
        this.Library = Library;
        this.setupEventListeners();
    }

    setupEventListeners() {
        DOMCache.get('newEntry').addEventListener('click', this.togglePopup)
        DOMCache.get('inputs').forEach(input => {
            if (input.classList.contains('alert-active')) {
                input.classList.remove('alert-active');
            }
        
            if (input.type !== 'checkbox') {
                input.addEventListener('focusout', (event) => this.showHelpText(event));
            }
        })
        DOMCache.get('cancelBtn').addEventListener('click', (event) => {
            event.preventDefault();

            // reset the form and go back to the Library page
            DOMCache.get('addBookForm').reset();
            this.showHelpText(event);
            this.togglePopup();
        })
        DOMCache.get('addBtn').addEventListener('click', (event) => {
            event.preventDefault();
        
            // Only proceed if the form is valid
            if(!this.validateForm(event)) {
                return;
            }
        
            this.addBookToLibrary();
            DOMCache.get('addBookForm').reset();
            this.togglePopup();
        })
    }

    togglePopup() {
        const addBookTab = DOMCache.get('addBookTab');
        const overlay = DOMCache.get('overlay');
        const isPopupVisible = addBookTab.style.display === 'block';

        DOMCache.get('inputs').forEach(input => {
            var helpTextID = input.getAttribute('data-help');
            var helpText = document.getElementById(helpTextID);
    
            if (helpText) {
                helpText.classList.remove('warning-active', 'alert-active');
            }
        });
    
        if (isPopupVisible) {
            addBookTab.style.display = 'none';
            overlay.style.display = 'none';
            document.body.classList.remove('blur');
        } else {
            addBookTab.style.display = 'block';
            overlay.style.display = 'block';
            document.body.classList.add('blur');
        }
    }

    showHelpText(input) {
        var invalidFormEntry = false;
        var inputNode;
        var helpTextID;
        var helpText

        if(input.target) {
            inputNode = input.target;
        }
        else {
            inputNode = input;
            invalidFormEntry = true;
        }

        helpTextID = inputNode.getAttribute('data-help');
        helpText = document.getElementById(helpTextID);

        if (inputNode.value.trim() !== '') {
            helpText.classList.remove('warning-active');
            helpText.classList.remove('alert-active');
            return;
        }

        if(helpText) {
            // Show shake animation when an invalid form entry is done
            if (invalidFormEntry) {
                helpText.classList.remove('warning-active');
                helpText.classList.remove('alert-active');
                void helpText.offsetWidth;
                helpText.classList.add('alert-active');

                if(helpText.classList.contains('warning-active')) {
                    helpText.addEventListener('animationend', () => {
                        helpText.classList.remove('alert-active');
                    })
                }
            }
            else if(!helpText.classList.contains('warning-active') && !helpText.classList.contains('alert-active')) {
                helpText.classList.add('warning-active');
            }
        }
    }

    validateForm(event) {
        var isValid = true;

        DOMCache.get('inputs').forEach(input => {
            if (input.type !== 'checkbox' && input.value.trim() === '') {
                isValid = false;
                this.showHelpText(input);
            }
        });
    
        return isValid;
    }

    addBookToLibrary() {
        const title = DOMCache.get('titleInput').value;
        const author = DOMCache.get('authorInput').value;
        const pages = DOMCache.get('pagesInput').value;
        const read = DOMCache.get('readCheckbox').checked;

        this.Library.addBook(new Book(title, author, pages, read));
    }
}

const myLibrary = new Library();
const ui = new UI(myLibrary);