"use strict";

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
      return `${title} by ${author}, ${pages} pages, ${
        read ? "read it" : "not read yet"
      }`;
    };
  }
}

const library = (function () {
  let myLibrary = [
    new Book("Hobbit", "J. R. R. Tolkien", 288, true),
    new Book("The Temple of the golden pavillion", "Yukio Mishima", 270, false),
  ];

  function get() {
    return myLibrary;
  }

  function set(value) {
    myLibrary = value;
  }

  function remove(e) {
    myLibrary.splice(getTargetBookIndex(e), 1);
  }

  function toggleRead(e) {
    const targetBook = myLibrary[getTargetBookIndex(e)];
    targetBook.read = targetBook.read ? false : true;
  }

  function getTargetBookIndex(e) {
    const bookTitle = e.target.dataset.targetTitle;
    const bookIndex = myLibrary.findIndex((book) => book.title === bookTitle);
    return bookIndex;
  }

  function add() {
    const book = new Book();

    const textInputs = document.querySelectorAll('[type="text"]');
    textInputs.forEach((textInput) => {
      book[textInput.name] = textInput.value || "n/a";
      textInput.value = "";
    });

    const radioInputs = document.querySelectorAll('[type="radio"]');
    radioInputs.forEach((radioInput) => {
      if (radioInput.checked) {
        book.read = radioInput.value;
      }
    });
    if (!book["read"]) {
      book.read = "n/a";
    }

    myLibrary.push(book);
  }

  return { get, set, remove, add, toggleRead };
})();

const save = (function () {
  function init() {
    if (localStorage.getItem("myLibrary")) {
      get();
    } else {
      set();
    }
  }

  function get() {
    library.set(JSON.parse(localStorage.getItem("myLibrary")));
  }

  function set() {
    localStorage.setItem("myLibrary", JSON.stringify(library.get()));
  }

  return { init, set };
})();

const displayController = (function () {
  function toggleModal() {
    const modal = document.querySelector(".modal");
    modal.classList.toggle("show");

    const textInputs = document.querySelectorAll('[type="text"]');
    textInputs.forEach((textInput) => {
      textInput.value = "";
    });
  }

  function render() {
    const mainDiv = document.querySelector(".main");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info-div");
    mainDiv.appendChild(infoDiv);

    addBookCards();
    addDescs();
    addBtn("delete");
    addBtn("toggleRead");
  }

  function addBookCards() {
    const infoDiv = document.querySelector(".info-div");

    for (let i = 0; i < library.get().length; i++) {
      const card = document.createElement("div");
      card.classList.add("card");
      infoDiv.appendChild(card);
    }
  }

  function addDescs() {
    for (let i = 0; i < library.get().length; i++) {
      const card = document.querySelector(`.card:nth-of-type(${i + 1})`);

      for (let property in library.get()[i]) {
        if (property === "info") continue;

        const bookProperty = document.createElement("div");
        bookProperty.classList.add(`${property}-div`);
        bookProperty.textContent = library.get()[i][property];
        card.appendChild(bookProperty);
      }
    }
  }

  function addBtn(task) {
    for (let i = 0; i < library.get().length; i++) {
      const btn = document.createElement("button");
      btn.dataset.targetTitle = library.get()[i].title;

      if (task === "delete") {
        btn.classList.add("del-btn");
        btn.textContent = "delete";
        btn.addEventListener("click", handleDeleteBtn);
      } else if (task === "toggleRead") {
        btn.textContent = "toggle Read";
        btn.addEventListener("click", handleToggleReadBtn);
      }

      const card = document.querySelector(`.card:nth-of-type(${i + 1})`);
      card.appendChild(btn);
    }
  }

  function handleDeleteBtn(e) {
    library.remove(e);
    refresh();
  }

  function handleToggleReadBtn(e) {
    library.toggleRead(e);
    refresh();
  }

  function clear() {
    document.querySelector(".info-div").remove();
  }

  function refresh() {
    clear();
    render();
    save.set();
  }

  (function addEventListeners() {
    const addBtn = document.querySelector(".add-btn");
    addBtn.addEventListener("click", toggleModal);

    const form = document.querySelector("form");
    form.addEventListener("submit", handleFormSubmit);
    form.addEventListener("reset", toggleModal);
  })();

  function handleFormSubmit() {
    library.add();
    toggleModal();
    refresh();
  }

  return { render };
})();

save.init();
displayController.render();
