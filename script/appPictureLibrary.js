//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event
let pageContentInModal = document.querySelector(".pageContentInModal");
let closeBtn = document.querySelector(".windowModalHeader .btnCloseModal");

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  closeBtn.addEventListener("click", () => {
    pageContentInModal.style.display = "none";
  });

  //if you want clicking outside shall close
  window.addEventListener("click", (e) => {
    if (e.target == pageContentInModal) {
      pageContentInModal.style.display = "none";
    }
  });

  console.log(library);

  const counter = document.querySelector("#counter");
  counter.innerHTML = library.albums.length;

  showLibrary();
});

function showLibrary() {
  const div = document.createElement("div");
  div.className = "FlexWrap FlexWrapAlbums";

  const content = document.querySelector(".content");
  content.innerHTML = "";

  content.appendChild(div);

  for (const album of library.albums) {
    renderAlbumImage(album);

    for (const picture of album.pictures) {
      //  renderImage(`${album.path}/${picture.imgLoRes}`, picture.id);
      //  renderImage(`${album.path}/${picture.imgHiRes}`, picture.id);
    }
  }
}

function showAlbum(album) {
  const content = document.querySelector(".content");
  content.innerHTML = "";

  const backDiv = document.createElement("div");
  backDiv.className = "back";
  backDiv.innerHTML = "Back to library 👈";

  backDiv.addEventListener("click", (event) => {
    showLibrary();
  });

  content.appendChild(backDiv);

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = album.title;
  titleDiv.className = "album-title";

  content.appendChild(titleDiv);

  const div = document.createElement("div");
  div.className = "FlexWrap FlexWrapImages";

  content.appendChild(div);

  for (const picture of album.pictures) {
    renderImage(picture, album);
    // renderImage(`${album.path}/${picture.imgHiRes}`, picture.id);
  }
}

function showImage(picture, album) {
  const pictureWrapper = document.querySelector(".pictureWrapper");
  pictureWrapper.dataset.id = picture.id;

  console.log(picture.id);
  const modalh2 = document.querySelector(".modalh2");
  modalh2.innerText = picture.title;

  modalh2.addEventListener("input", (event) => {
    picture.title = event.target.innerText;
    console.log(event.target.innerText);
  });

  const url = `${album.path}/${picture.imgHiRes}`;
  console.log(picture);

  const modalImage = document.createElement("img");
  modalImage.className = `windowModalContentImage`;
  modalImage.dataset.id = picture.id;
  modalImage.src = url;

  const divModalImage = document.querySelector(".modalImage");
  divModalImage.innerHTML = "";
  divModalImage.appendChild(modalImage);

  const modalRating = document.querySelector(".modalRating");
  modalRating.innerHTML = "";
  createRating(picture.id, modalRating);

  const modalComments = document.querySelector(".modalComments");
  modalComments.innerText = picture.comment;
  pageContentInModal.style.display = "block";

  modalComments.addEventListener("input", (event) => {
    picture.comment = event.target.innerText;
    console.log(event.target.innerText);
  });

  const editBtn = document.querySelector("#editSave");

  editBtn.addEventListener("click", (event) => {
    if (modalh2.contentEditable == "true") {
      modalh2.contentEditable = "false";
      modalComments.contentEditable = "false";
      event.target.innerText = "Edit";
    } else {
      modalh2.contentEditable = "true";
      modalComments.contentEditable = "true";
      event.target.innerText = "Done";
    }
  });
}

function editText(picture, value) {
  picture.title = value;
  console.log(value);
}

//Render the images
function renderImage(picture, album) {
  console.log("COMMEnT:", picture.comment);
  const url = `${album.path}/${picture.imgLoRes}`;
  console.log(picture);
  const flexItemDiv = document.createElement("div");
  flexItemDiv.className = `pictureWrapper FlexItem`;
  flexItemDiv.dataset.id = picture.id;

  flexItemDiv.addEventListener("click", () => showImage(picture, album));

  const img = document.createElement("img");
  img.src = url;
  flexItemDiv.appendChild(img);

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = picture.title;
  titleDiv.className = "title";

  flexItemDiv.appendChild(titleDiv);

  const commentWrapperDiv = document.createElement("div");
  commentWrapperDiv.className = "commentWrapper";

  flexItemDiv.appendChild(commentWrapperDiv);

  const commentDiv = document.createElement("div");
  commentDiv.innerHTML = picture.comment;
  commentDiv.className = "comment";

  commentWrapperDiv.appendChild(commentDiv);

  const imgFlex = document.querySelector(".FlexWrapImages");
  imgFlex.appendChild(flexItemDiv);
}

function createRating(pictureId, parent) {
  const ratingDiv = document.createElement("div");
  ratingDiv.className = "rating";
  ratingDiv.dataset.id = pictureId;
  parent.appendChild(ratingDiv);

  for (let i = 1; i <= 5; i++) {
    const star = createStar(i);
    ratingDiv.appendChild(star);
  }

  const rating = getRating(pictureId);

  renderRatingColors(pictureId, rating);
}

function createStar(index) {
  const starTemplate = document.createElement("div");
  starTemplate.className = "star fa fa-star";
  starTemplate.dataset.rating = index;

  starTemplate.addEventListener("click", (event) => {
    ratePicture(event.target);
  });

  return starTemplate;
}

function getRating(pictureId) {
  const ratingVarName = "rating-" + pictureId;

  return window.localStorage.getItem(ratingVarName);
}

function setRating(pictureId, rating) {
  const ratingVarName = "rating-" + pictureId;

  return window.localStorage.setItem(ratingVarName, rating);
}

function ratePicture(starElement) {
  console.log(starElement.dataset.rating);
  const ratingElement = starElement.closest(".rating");

  const pictureId = ratingElement.dataset.id;

  // Värde mellan 1-5
  let rating = starElement.dataset.rating;

  const currentRating = getRating(pictureId);

  if (currentRating && currentRating == rating) {
    rating = 0;
  }

  setRating(pictureId, rating);
  renderRatingColors(pictureId, rating);
}

function renderRatingColors(pictureId, rating) {
  const ratingElement = document.querySelector(
    `.rating[data-id='${pictureId}']`
  );

  const starElements = ratingElement.querySelectorAll(".star");

  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      starElements[i].classList.add("checked");
    } else {
      starElements[i].classList.remove("checked");
    }
  }
}

//Render the images
function renderAlbumImage(album) {
  const src = album.headerImage;
  const tag = album.id;
  const title = album.title;

  const div = document.createElement("div");
  div.className = `albumWrapper FlexItem`;
  div.dataset.albumId = tag;

  div.addEventListener("click", () => showAlbum(album));

  const img = document.createElement("img");
  img.src = src;
  div.appendChild(img);

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = title;
  titleDiv.className = "title";
  div.appendChild(titleDiv);

  const imgFlex = document.querySelector(".FlexWrapAlbums");
  imgFlex.appendChild(div);
}
