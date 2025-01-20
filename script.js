const booksGrid = document.querySelector('.books');
const newEntry = document.querySelector('#newEntry')
const emptyLibMsg = document.querySelector('#emptyLibMsg');
const addButton = document.querySelector('.add');
const addBookTab = document.querySelector('#addBookTab');
const addBookForm = document.querySelector('#addBookForm');
const inputs = document.querySelectorAll('input');
const helpTexts = document.querySelectorAll('.helpText');

const bookTitle = document.querySelector('#bookTitle');
const bookAuthor = document.querySelector('#author');
const bookPages = document.querySelector('#noOfPages');
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
    
    while (booksGrid.hasChildNodes()) {
        booksGrid.removeChild(booksGrid.firstChild);
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
    
        booksGrid.appendChild(book);
    }

    if (booksGrid.hasChildNodes()) {
        emptyLibMsg.style.display = 'none';
    }
}

// Function to toggle the popup
function togglePopup() {
    const isPopupVisible = addBookTab.style.display === 'block';

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

function isFormEmpty() {
    var emptyInputs = [];
    inputs.forEach(input => {
        if (input.type !== 'checkbox' && input.value.trim() === '') {

            // Remove Below
            console.log(`Empty input detected: ${input.id}`);
            // till here

            emptyInputs.push(input.id);
        }
    });
    
    console.log('Empty inputs:', emptyInputs); // Debug log
    return emptyInputs.length > 0 ? emptyInputs : null;
}

function toggleWarning() {
    var helpTextID = 'helpText' + this.id;
    var helpText = document.getElementById(helpTextID);
    const isWarningActive = helpText.classList.contains('warning-active');

    if(isWarningActive && this.value.trim() !== '') {
        helpText.classList.remove('warning-active');
    }
    else if (this.value.trim() === '') {
        helpText.classList.add('warning-active');
    }
}

function Alert(emptyInputs) {
    var helpTextID;
    var helpText;

    emptyInputs.forEach(input => {
        helpTextID = 'helpText' + input;
        helpText = document.getElementById(helpTextID);
        // helpText.classList.add('alert-active');

        // Remove Below
        console.log(`Checking: ${helpTextID}`, helpText); // Debug log

        if (helpText) {
            // Force re-trigger animation
            helpText.classList.remove('alert-active');
            void helpText.offsetWidth; // Trigger reflow
            helpText.classList.add('alert-active');

            // Ensure animationend triggers correctly
            helpText.addEventListener('animationend', () => {
                console.log(`Animation ended for: ${helpTextID}`);
                helpText.classList.remove('alert-active');
            }, { once: true }); // `once: true` ensures the listener is removed after execution
        } else {
            console.error(`No helpText element found for ID: ${helpTextID}`);
        }

        // Till here
        
        // helpText.onanimationend = () => {
        //     helpText.classList.remove('alert-active');
        // };

    });
}

inputs.forEach(input => {
    if (input.classList.contains('alert-active')) {
        input.classList.remove('alert -active');
    }

    if (input.type !== 'checkbox') {
        input.addEventListener('focusout', toggleWarning);
    }
 });

newEntry.addEventListener('click', togglePopup)
addButton.addEventListener('click', (event) => {
    event.preventDefault();
    var emptyInputs = isFormEmpty();
    
    if(emptyInputs) {
        Alert(emptyInputs);
        return;
    }

    addBookToLibrary();
    addBookForm.reset();
    togglePopup();
})

 const books = document.querySelectorAll('.book');

