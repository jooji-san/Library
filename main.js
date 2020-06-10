'use strict';

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${title} by ${author}, ${pages} pages, ${read ? 'read it' : 'not read yet'}`;
  };
}

function addBookToLibrary(obj) {
  myLibrary.push(obj);
}

function showModal() {
  const modal = document.querySelector('.modal');
  modal.classList.toggle('show');

  const textInputs = document.querySelectorAll('[type="text"]');
  textInputs.forEach(textInput => {
    textInput.value = '';
  });
}

function addBookCards() {
  const infoDiv = document.querySelector('.info-div');

  for (let i = 0; i < myLibrary.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    infoDiv.appendChild(card);
  }
}

function addDescs() {
  for (let i = 0; i < myLibrary.length; i++) {
    const card = document.querySelector(`.card:nth-of-type(${i + 1})`);

    for (let property in myLibrary[i]) {
      if (property === 'info') continue;

      const bookProperty = document.createElement('div');
      bookProperty.classList.add(`${property}-div`);
      bookProperty.textContent = myLibrary[i][property];
      card.appendChild(bookProperty);
    }
  }
}

function addBtn(task) {
  for (let i = 0; i < myLibrary.length; i++) {
    const btn = document.createElement('button');
    btn.dataset.targetTitle = myLibrary[i].title;

    if (task === 'delete') {
      btn.classList.add('del-btn')
      btn.textContent = 'delete';
      btn.addEventListener('click', deleteBook);
    } else if (task === 'toggleRead') {
      btn.textContent = 'toggle Read';
      btn.addEventListener('click', toggleRead)
    }

    const card = document.querySelector(`.card:nth-of-type(${i + 1})`);
    card.appendChild(btn);
  }
}

function render() {
  const mainDiv = document.querySelector('.main');

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info-div');
  mainDiv.appendChild(infoDiv);

  addBookCards();
  addDescs()
  addBtn('delete');
  addBtn('toggleRead')
}

function clearInfo() {
  document.querySelector('.info-div').remove();
}

function getTargetBookIndex(e) {
  const bookTitle = e.target.dataset.targetTitle;
  const bookIndex = myLibrary.findIndex(book => book.title === bookTitle);
  return bookIndex;
}

function deleteBook(e) {
  myLibrary.splice(getTargetBookIndex(e), 1);

  clearInfo();
  render();
  set();
}

function toggleRead(e) {
  const targetBook = myLibrary[getTargetBookIndex(e)];

  targetBook.read = targetBook.read ? false : true;

  clearInfo();
  render();
}

function readAndWrite() {
  const book = new Book();

  const textInputs = document.querySelectorAll('[type="text"]');
  textInputs.forEach(textInput => {
    book[textInput.name] = textInput.value || 'n/a';
    textInput.value = '';
  });

  const radioInputs = document.querySelectorAll('[type="radio"]');
  radioInputs.forEach(radioInput => {
    if (radioInput.checked) {
      book.read = radioInput.value;
    }
  });
  if (!book['read']) {
    book.read = 'n/a';
    console.log('hehe')
  }

  addBookToLibrary(book);
  showModal();
  clearInfo();
  render();
  set();
}

function addEventListeners() {
  const addBtn = document.querySelector('.add-btn');
  addBtn.addEventListener('click', showModal);

  const okBtn = document.querySelector('.ok-btn');
  okBtn.addEventListener('click', readAndWrite);

  const cancelBtn = document.querySelector('.cancel-btn');
  cancelBtn.addEventListener('click', showModal);
}

function get() {
  myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
}

function set() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function SaveOnStart() {
  if (localStorage.getItem('myLibrary')) {
    get();
  } else {
    set();
  }
}


let myLibrary = [];

addBookToLibrary(new Book('Hobbit', 'J. R. R. Tolkien', 288, true));
addBookToLibrary(new Book('The Temple of the golden pavillion', 'Yukio Mishima', 270, false));

SaveOnStart();

render();
addEventListeners();