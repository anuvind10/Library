const grid = document.querySelector('.books');
const addButton = document.querySelector('.addButton');

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
    
        title.textContent = myLibrary[i].title;
        author.textContent = myLibrary[i].author;
        pages.textContent = myLibrary[i].pages;
        read.textContent = myLibrary[i].read;
    
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
}

addButton.addEventListener('click', getDetails);
const books = document.querySelectorAll('.book');
displayBooks();
