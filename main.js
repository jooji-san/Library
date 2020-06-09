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

function addTitleRow() {
  const titleRow = document.createElement('div');
  titleRow.classList.add('title-row');
  for (let property in myLibrary[0]) {
    if (property === 'info') continue;

    const title = document.createElement('div');
    title.classList.add(`${property}-div`);
    title.textContent = property;
    titleRow.appendChild(title);
  }

  const infoDiv = document.querySelector('.info-div');
  infoDiv.appendChild(titleRow);
}

function addDescRows() {
  for (let i = 0; i < myLibrary.length; i++) {
    const bookRow = document.createElement('div');
    bookRow.classList.add('book-row');

    for (let property in myLibrary[i]) {
      if (property === 'info') continue;

      const bookProperty = document.createElement('div');
      bookProperty.classList.add(`${property}-div`);
      bookProperty.textContent = myLibrary[i][property];
      bookRow.appendChild(bookProperty);
    }
    const infoDiv = document.querySelector('.info-div');
    infoDiv.appendChild(bookRow);
  }
}

function addBtnRows(task) {
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

    const bookRow = document.querySelector(`.book-row:nth-of-type(${i + 2})`);
    bookRow.appendChild(btn);
  }
}

function render() {
  const mainDiv = document.querySelector('.main');

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info-div');
  mainDiv.appendChild(infoDiv);

  addTitleRow();
  addDescRows();
  addBtnRows('delete');
  addBtnRows('toggleRead');

  setPropertyWidth();
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
    book[textInput.name] = textInput.value;
    textInput.value = '';
  });

  const radioInputs = document.querySelectorAll('[type="radio"]')
  radioInputs.forEach(radioInput => {
    if (radioInput.checked) book[radioInput.name] = radioInput.value;
  });

  addBookToLibrary(book);
  showModal();
  clearInfo();
  render();
}

function addEventListeners() {
  const addBtn = document.querySelector('.add-btn');
  addBtn.addEventListener('click', showModal);

  const okBtn = document.querySelector('.ok-btn');
  okBtn.addEventListener('click', readAndWrite);

  const cancelBtn = document.querySelector('.cancel-btn');
  cancelBtn.addEventListener('click', showModal);
}

function setPropertyWidth() {
  Object.keys(myLibrary[0]).forEach((property, index) => {
    if (property === 'info') return;

    let maxLength = 0;
    let BookIndexOfMax;
    for (let i = 0; i < myLibrary.length; i++) {
      const bookIndex = i;
      const length = myLibrary[i][property].toString().length;

      if (length > maxLength) {
        maxLength = length;
        BookIndexOfMax = bookIndex;
      }
    }

    const maxDiv = document.querySelector(`.book-row:nth-of-type(${BookIndexOfMax + 2}) div:nth-of-type(${index + 1})`);
    const maxDivWidth = maxDiv.offsetWidth;

    const propertyDivs = document.querySelectorAll(`.${property}-div`);
    propertyDivs.forEach(div => {
      div.style.width = `${maxDivWidth}px`;
    });

  });
}

const myLibrary = [];

addBookToLibrary(new Book('Hobbit', 'J. R. R. Tolkien', 288, true));
addBookToLibrary(new Book('The Temple of the golden pavillion', 'Yukio Mishima', 270, false));

render();
addEventListeners();