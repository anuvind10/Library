const booksGrid = document.querySelector('.books');
const newEntry = document.querySelector('#newEntry')
const emptyLibMsg = document.querySelector('#emptyLibMsg');
const addButton = document.querySelector('#addBtn');
const cancelButton = document.querySelector('#cancelBtn');
const addBookTab = document.querySelector('#addBookTab');
const addBookForm = document.querySelector('#addBookForm');
const inputs = document.querySelectorAll('input');

const bookTitle = document.querySelector('#Title');
const bookAuthor = document.querySelector('#Author');
const bookPages = document.querySelector('#Pages');
const bookRead = document.querySelector('#readChk');

const overlay = document.createElement('div');

// Add an overlay to the DOM
overlay.id = 'overlay';
document.body.appendChild(overlay);

const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Main Function
function LibraryMain() {
    
    newEntry.addEventListener('click', togglePopup)

    // Show help text if no value is entered
    inputs.forEach(input => {
        if (input.classList.contains('alert-active')) {
            input.classList.remove('alert-active');
        }
    
        if (input.type !== 'checkbox') {
            input.addEventListener('focusout', showHelpText);
        }
     });

    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        // reset the form and go back to the Library page
        addBookForm.reset();
        showHelpText(event);
        togglePopup();
    });

    addButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Only proceed if the form is valid
        if(!validateForm(event)) {
            return;
        }
    
        addBookToLibrary();
        addBookForm.reset();
        togglePopup();
    });
}

function addBookToLibrary () {

    var title = bookTitle.value;
    var author = bookAuthor.value;
    var pages = bookPages.value;
    var read = bookRead.checked? "Read" : "Not Read";
    
    var newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook)

    displayBooks();
}

function displayBooks() {
    
    // Remove all child nodes and build the DOM again
    while (booksGrid.hasChildNodes()) {
        booksGrid.removeChild(booksGrid.firstChild);
    }

    for (i = 0; i < myLibrary.length; i++) {
        var book = document.createElement('div');
        book.id = 'book-' + i;
        book.classList.add('book');
    
        var title = document.createElement('p');
        var author = document.createElement('p');
        var pages = document.createElement('p');
        var read = document.createElement('button');
        var deleteBtn = document.createElement('img');
    
        title.innerHTML = "<span class='header'>Title: </span>" + myLibrary[i].title;
        author.innerHTML = "<span class='header'>Author: </span>" + myLibrary[i].author;
        pages.innerHTML = "<span class='header'>No. of Pages: </span>" + myLibrary[i].pages;
        read.textContent = myLibrary[i].read;
        deleteBtn.src = "./icons/delete.png";
        deleteBtn.alt = "delete";

        if (myLibrary[i].read !== 'Not Read') {
            read.classList.add('read');
        }
        else {
            read.classList.add('notRead');
        }

        title.id = 'title-' + i;
        author.id = 'author-' + i;
        pages.id = 'pages-' + i;
        read.id = 'readBtn-' + i;
        deleteBtn.id = "deleteBtn-" + i;

        title.classList.add('details');
        author.classList.add('details');
        pages.classList.add('details');
        read.classList.add('details', 'readBtn');
        deleteBtn.classList.add('png', 'deleteBtn')

        read.setAttribute('data-read-id', `book-${i}`);

        book.appendChild(title);
        book.appendChild(author);
        book.appendChild(pages);
        book.appendChild(read);
        book.appendChild(deleteBtn);
    
        booksGrid.appendChild(book);
    }

    if (booksGrid.hasChildNodes()) {
        emptyLibMsg.style.display = 'none';
    }
    else {
        emptyLibMsg.style.display = "block";
    }

    const books = document.querySelectorAll('.book');
    books.forEach(book => {
        book.addEventListener('mouseenter', toggleDelete);
        book.addEventListener('mouseleave', toggleDelete);
    });

    const readBtns = document.querySelectorAll('.readBtn');
    readBtns.forEach(button => {
        button.addEventListener('click', toggleRead);
    });

    const deleteBtns = document.querySelectorAll('.deleteBtn');
    deleteBtns.forEach(button => {
        button.addEventListener('click', deleteBook);
    });

}

// Display help texts if invalid input is provided
function validateForm(event) {
    var isValid = true;

    inputs.forEach(input => {
        if (input.type !== 'checkbox' && input.value.trim() === '') {
            isValid = false;
            showHelpText(input);
        }
    });

    return isValid;
}

function showHelpText(input) {
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

function deleteBook() {
    var bookID = this.id.split('-')[1];

    // Remove the book from myLibrary
    if (bookID) {
        myLibrary.splice(bookID, 1);
    }

    displayBooks();
}

// Toggles the form when new entry is clicked
function togglePopup() {
    const isPopupVisible = addBookTab.style.display === 'block';

    inputs.forEach(input => {
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

// Toggles the 'read' option of a book
function toggleRead () {
    const isRead = this.classList.contains('read');
    var bookID = this.getAttribute('data-read-id').split('-')[1];

    if (isRead) {
        this.classList.remove('read');
        this.classList.add('notRead');
        myLibrary[bookID].read = 'Not Read';
    }
    else {
        this.classList.remove('notRead');
        this.classList.add('read');
        myLibrary[bookID].read = 'Read';
    }

    displayBooks();
}

// Delete button appears dynamically on each book
function toggleDelete() {
    var bookID = this.id.split('-')[1];
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

LibraryMain();