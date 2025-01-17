const grid = document.querySelector('.books');
const addButton = document.querySelector('.addBook');
const emptyLibMsg = document.querySelector('#emptyLibMsg');
const addBookPage = document.querySelector('#addBook');

const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary (title, author, pages, read) {
    
    var newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook)

}

function getDetails() {
    
    var title = prompt("Title")
    var author = prompt("Author")
    var pages = prompt("No. of Pages")
    var read = prompt("Have you read it?")

    addBookToLibrary(title, author, pages, read);
    displayBooks();
}

function displayBooks() {
    
    while (grid.hasChildNodes()) {
        grid.removeChild(grid.firstChild);
    }

    for (i = 0; i < myLibrary.length; i++) {
        var book = document.createElement('div');
        book.classList.add('book');
    
        var title = document.createElement('p');
        var author = document.createElement('p');
        var pages = document.createElement('p');
        var read = document.createElement('p');
    
        title.innerHTML = "<span class='details'>Title: </span>" + myLibrary[i].title;
        author.innerHTML = "<span class='details'>Author: </span>" + myLibrary[i].author;
        pages.innerHTML = "<span class='details'>No. of Pages: </span>" + myLibrary[i].pages;
        read.innerHTML = "<span class='details'>Read: </span>" + myLibrary[i].read;
    
        title.classList.add('title');
        author.classList.add('author');
        pages.classList.add('pages');
        read.classList.add('read');
    
        book.appendChild(title);
        book.appendChild(author);
        book.appendChild(pages);
        book.appendChild(read);
    
        grid.appendChild(book);
    }

    if (grid.hasChildNodes()) {
        emptyLibMsg.style.display = 'none';
    }
}

addButton.addEventListener('click', () => {
    getDetails();
    // addBookPage.classList.add('active')
});
const books = document.querySelectorAll('.book');

displayBooks();
