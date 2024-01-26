let likeBook;
const bookList = document.querySelector("#list");
let mainUser;

//Fetch user data
fetch("http://localhost:3000/users")
  .then(res => res.json())
  .then(users => mainUser = users[0])

//Fetch book data
fetch("http://localhost:3000/books")
  .then(res => res.json())
  .then(books => renderBooks(books))

function renderBooks(books) {
  books.forEach(book => renderBook(book));
}

//Display book titles onto page
function renderBook(book) {

  const bookLi = document.createElement("li");
  bookLi.textContent = book.title;
  bookList.append(bookLi);

  bookLi.addEventListener("click", () => showBook(book))
}

//Show book information after click
function showBook(book) {
  book.users.forEach(user => {
    likeBook = user.username === "pouros";
  })
  const showPanel = document.querySelector("#show-panel");
  showPanel.innerHTML = `
    <br />
    <img src=${book.img_url} alt="image of book"/><br />
    <br />
    <strong>${book.title}</strong><br />
    <br />
    <strong>${book.subtitle}</strong><br />
    <br />
    <strong>${book.author}</strong><br />
    <p>${book.description}</p>
    <ul>

    </ul>
    <button>${likeBook ? "UNLIKE" : "LIKE"}</button>
  `
  const userUl = showPanel.querySelector("ul");
  book.users.forEach(user => loopThroughLikes(user, userUl));
  const id = book.id;
  const users = book.users
  showPanel.querySelector("button").addEventListener("click", e => handleLikeToggle(id, users))
}

//Loop through users who liked the book
function loopThroughLikes(user, userUl) {
  const userLi = document.createElement("li");
  userLi.textContent = user.username;
  userUl.append(userLi);
}

//patch users database and toggle like button
function handleLikeToggle(id, users) {
  const ifUserHasLiked = users.some(user => {
    return user.username === "pouros";
  })

  const removeUserFromLikes = users.filter(user => user.username !== "pouros")

  const addUserToLikes = () => [...users, mainUser];

  if (ifUserHasLiked)
    patchData(removeUserFromLikes)
  else
    patchData(addUserToLikes())

  //patch data
  function patchData(variable) {
    fetch(`http://localhost:3000/books/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        users: variable
      })
    })
      .then(res => res.json())
      .then((updatedBook) => showBook(updatedBook))
  }
}