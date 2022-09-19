//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event
let pageContentInModal = document.querySelector(".pageContentInModal");
let closeBtn = document.querySelector(".windowModalHeader .btnCloseModal");
let slideBtn = document.querySelector("#slideBtn");

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
  slideBtn.hidden = true;
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
  slideBtn.hidden = false;

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
  // skapa upp en input

  // skapa listener på inputen
  // i listenern lägg till bildens id i en array

  for (const picture of album.pictures) {
    renderImage(picture, album);
    // renderImage(`${album.path}/${picture.imgHiRes}`, picture.id);
  }
}

let saveListener;

function showImageInModal(picture, album) {
  const pictureWrapper = document.querySelector(".pictureWrapper");
  pictureWrapper.dataset.id = picture.id;

  console.log(picture.id);
  const modalh2 = document.querySelector(".modalh2");
  modalh2.innerText = picture.title;

  saveListener = modalh2.addEventListener("input", (event) => {
    picture.title = event.target.innerText;
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
}

const editBtn = document.querySelector("#editSave");

editBtn.addEventListener("click", (event) => {
  const parent = event.target.closest(".pageContentInModal");
  const modalh2 = parent.querySelector(".modalh2");
  const modalComments = parent.querySelector(".modalComments");

  if (modalh2.contentEditable == "true") {
    console.log("content is editable");

    modalh2.contentEditable = "false";
    modalComments.contentEditable = "false";
    event.target.innerText = "Edit";
  } else {
    console.log("content is not editable");
    modalh2.contentEditable = "true";
    modalComments.contentEditable = "true";
    event.target.innerText = "Done";
  }
});

//Render the images
function renderImage(picture, album) {
  console.log("COMMEnT:", picture.comment);
  const url = `${album.path}/${picture.imgLoRes}`;
  console.log(picture);
  const flexItemDiv = document.createElement("div");
  flexItemDiv.className = "pictureWrapper FlexItem";
  flexItemDiv.dataset.id = picture.id;

  //skapa en div som wrappar innehållet (bild, titel kommentar).
  // Klickfunktionen ligger här
  const contentDiv = document.createElement("div");
  contentDiv.className = "pictureContent";
  flexItemDiv.appendChild(contentDiv);

  //skapa upp en checkbox för slideshowen
  const checboxDiv = document.createElement("div");
  checboxDiv.className = "chechboxWrapper";
  flexItemDiv.appendChild(checboxDiv);

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "slideshowPicker";

  //hämta bildens id och lägger i checkboxen
  checkBox.dataset.id = picture.id;
  checkBox.id = `checkbox-${picture.id}`;
  const slideArray = JSON.parse(window.localStorage.getItem("slideArray"));
  console.log("slsidde", slideArray);
  checkBox.checked = slideArray.includes(picture.id) ? true : false;

  checboxDiv.appendChild(checkBox);

  const checkBoxLabel = document.createElement("label");
  checkBoxLabel.innerText = "Add to slideshow";
  checkBoxLabel.htmlFor = `checkbox-${picture.id}`;
  checboxDiv.appendChild(checkBoxLabel);

  // skapa en event listener som lyssnar på "change" på checkboxen
  checkBox.addEventListener("change", (event) => {
    let slideArray = JSON.parse(window.localStorage.getItem("slideArray")); //JSonParse
    if (typeof slideArray === "undefined" || slideArray == null) {
      slideArray = [];
    }
    // när man klickar på den så vill ni lägga till eller ta bort pictureid i slideshow-arrayen
    if (checkBox.checked == true) {
      // lägger till pictureId till array
      slideArray.push(picture.id);
      console.log(slideArray);
    } else if (checkBox.checked == false) {
      slideArray = slideArray.filter(function (value) {
        return value != picture.id;
      });

      console.log(slideArray);
    }
    window.localStorage.setItem("slideArray", JSON.stringify(slideArray));
  });

  slideBtn.addEventListener("click", () => showSlideshow());

  // skapa en funktion för att hämta slideshow-arrayen från local storage
  function showSlideshow() {
    const slideTitle = document.querySelector(".slideTitle");
    slideTitle.innerText = picture.title;
    slideArray = JSON.parse(window.localStorage.getItem("slideArray"));
  }

  contentDiv.addEventListener("click", () => showImageInModal(picture, album));

  const img = document.createElement("img");
  img.src = url;
  contentDiv.appendChild(img);

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = picture.title;
  titleDiv.className = "title";

  contentDiv.appendChild(titleDiv);

  const commentWrapperDiv = document.createElement("div");
  commentWrapperDiv.className = "commentWrapper";

  contentDiv.appendChild(commentWrapperDiv);

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
