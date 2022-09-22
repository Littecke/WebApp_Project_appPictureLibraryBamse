//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import { pictureLibraryBrowser } from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event

// Global var for eventlistener
let saveListener;

// Create modal elements and connect to html code
let pageContentInModal = document.querySelector(".pageContentInModal");
let closeBtn = document.querySelector(".windowModalHeader .btnCloseModal");

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server

  // Eventlistener to closebutton in modal window
  closeBtn.addEventListener("click", () => {
    pageContentInModal.style.display = "none";
  });

  //if you click outside the modal shall close
  window.addEventListener("click", (e) => {
    if (e.target == pageContentInModal) {
      pageContentInModal.style.display = "none";
    }
  });

  // show number of albums
  const counter = document.querySelector("#counter");
  counter.innerHTML = library.albums.length;

  initModal();
  showLibrary();
});

function initModal() {
  // Element connected to edit button in html
  const editBtn = document.querySelector("#editSave");

  // When clicked on edit button in modal we access everyting in modal via parent
  editBtn.addEventListener("click", (event) => {
    const parent = event.target.closest(".pageContentInModal");

    // ... title and comment is editable
    const modalh2 = parent.querySelector(".modalh2");
    const modalComments = parent.querySelector(".modalComments");

    // if edit is clicked it is possible to edit...
    if (modalh2.contentEditable == "true") {
      modalh2.contentEditable = "false";
      modalComments.contentEditable = "false";
      event.target.innerText = "Edit";
    } else {
      // ... and button text changes to "Done" and changes can no longer be done
      modalh2.contentEditable = "true";
      modalComments.contentEditable = "true";
      event.target.innerText = "Done";
    }
  });
}

// shows a list of all albums
function showLibrary() {
  // A div with name FlexWrap is created in content
  const div = document.createElement("div");
  div.className = "FlexWrap FlexWrapAlbums";

  const content = document.querySelector(".content");
  content.innerHTML = "";

  content.appendChild(div);

  // render all albums in our library and present them
  for (const album of library.albums) {
    renderAlbumImage(album);
  }
}

// Shows all images in selected album
function showAlbum(album) {
  const content = document.querySelector(".content");
  content.innerHTML = "";
  // created a back button to homepage
  const backDiv = document.createElement("div");
  backDiv.className = "back navButton";
  backDiv.innerHTML = "Back to library 👈";

  backDiv.addEventListener("click", (event) => {
    showLibrary();
  });

  content.appendChild(backDiv);

  const infoDiv = document.createElement("div");
  infoDiv.className = "album-info box";

  // shows album title
  const titleDiv = document.createElement("h2");
  titleDiv.innerHTML = album.title;
  titleDiv.className = "album-title title";

  infoDiv.appendChild(titleDiv);

  const commentDiv = document.createElement("div");
  commentDiv.innerHTML = album.comment;
  commentDiv.className = "album-comment desc";

  infoDiv.appendChild(commentDiv);

  const div = document.createElement("div");
  div.className = "FlexWrap FlexWrapImages";

  content.appendChild(infoDiv);
  content.appendChild(div);

  // render images in each album
  for (const picture of album.pictures) {
    renderImage(picture, album);
  }
}

// when clicked on a image this function creates content in modal...
function showImageInModal(picture, album) {
  const pictureWrapper = document.querySelector(".pictureWrapper");
  pictureWrapper.dataset.id = picture.id;

  const modalh2 = document.querySelector(".modalh2");
  modalh2.innerText = picture.title;

  // saves the edited title
  saveListener = modalh2.addEventListener("input", (event) => {
    picture.title = event.target.innerText;
  });

  const url = `${album.path}/${picture.imgHiRes}`;

  // add the image to the modal
  const modalImage = document.createElement("img");
  modalImage.className = `windowModalContentImage`;
  modalImage.dataset.id = picture.id;
  modalImage.src = url;

  const divModalImage = document.querySelector(".modalImage");
  divModalImage.innerHTML = "";
  divModalImage.appendChild(modalImage);

  // where one can rate the picture
  const modalRating = document.querySelector(".modalRating");
  modalRating.innerHTML = "";
  createRating(picture.id, modalRating);

  // and the images description
  const modalComments = document.querySelector(".modalComments");
  modalComments.innerText = picture.comment;
  pageContentInModal.style.display = "block";

  // saves the edites comment
  saveListener = modalComments.addEventListener("input", (event) => {
    picture.comment = event.target.innerText;
  });
}

//Render the image
function renderImage(picture, album) {
  const url = `${album.path}/${picture.imgLoRes}`;

  const flexItemDiv = document.createElement("div");
  flexItemDiv.className = "pictureWrapper FlexItem";
  flexItemDiv.dataset.id = picture.id;

  // creates div that wraps title, comments, image
  const contentDiv = document.createElement("div");
  contentDiv.className = "pictureContent";
  flexItemDiv.appendChild(contentDiv);

  // create checkbox for slideshow
  const checboxDiv = document.createElement("div");
  checboxDiv.className = "checkboxWrapper";
  flexItemDiv.appendChild(checboxDiv);

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "slideshowPicker";

  //get image id & adds to checkbox
  checkBox.dataset.id = picture.id;
  checkBox.id = `checkbox-${picture.id}`;

  // get all current picked images for slideshow
  let slideArray = JSON.parse(window.localStorage.getItem("slideArray"));

  // not existing - create an array
  if (typeof slideArray === "undefined" || slideArray == null) {
    slideArray = [];
  }
  // check if picture already was in array, and therefore should be checked
  checkBox.checked = slideArray.includes(picture.id) ? true : false;

  checboxDiv.appendChild(checkBox);

  const checkBoxLabel = document.createElement("label");
  checkBoxLabel.innerText = "Add to slideshow";
  checkBoxLabel.htmlFor = `checkbox-${picture.id}`;
  checboxDiv.appendChild(checkBoxLabel);

  // eventlistener listening on change on checkbox to add or remove
  // image from slideshow in local storage
  checkBox.addEventListener("change", (event) => {
    // parse data to object from json string
    let slideArray = JSON.parse(window.localStorage.getItem("slideArray"));
    // create empty array if null
    if (typeof slideArray === "undefined" || slideArray == null) {
      slideArray = [];
    }
    // if user checked checkbox add it to array
    if (checkBox.checked == true) {
      // adds checked image to array
      slideArray.push(picture.id);

      // if user uncheched, remove image from array
    } else if (checkBox.checked == false) {
      slideArray = slideArray.filter(function (value) {
        return value != picture.id;
      });
    }
    // converts array to string so it can be stored in local storage
    window.localStorage.setItem("slideArray", JSON.stringify(slideArray));
  });

  // eventlistener to show image in modal
  contentDiv.addEventListener("click", () => showImageInModal(picture, album));

  // creates images, title and comment elements in modal
  const img = document.createElement("div");
  img.className = "img";
  img.style.backgroundImage = `url("${url}")`;
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

// function that creates a star for rating, creates stars five times
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

// returns a star element
function createStar(index) {
  const starTemplate = document.createElement("div");
  starTemplate.className = "star fa fa-star";
  starTemplate.dataset.rating = index;

  starTemplate.addEventListener("click", (event) => {
    ratePicture(event.target);
  });

  return starTemplate;
}

// get the rating from local storage
function getRating(pictureId) {
  const ratingVarName = "rating-" + pictureId;

  let rating = window.localStorage.getItem(ratingVarName);

  if (typeof rating === "undefined" || rating == null) {
    rating = 0;
  }

  return rating;
}

// sets the rating in localstorge
function setRating(pictureId, rating) {
  const ratingVarName = "rating-" + pictureId;

  return window.localStorage.setItem(ratingVarName, rating);
}

// user clicks on stars to rate image
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

// as many stars as the rating is high is colored
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

//Render the thumbnail for albums
function renderAlbumImage(album) {
  const src = album.headerImage;
  const tag = album.id;
  const title = album.title;

  const div = document.createElement("div");
  div.className = `albumWrapper FlexItem`;
  div.dataset.albumId = tag;

  // event listener for clicked thumbnail that shows whole album
  div.addEventListener("click", () => showAlbum(album));

  const img = document.createElement("div");
  img.className = "img";
  img.style.backgroundImage = `url("${src}")`;

  div.appendChild(img);

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = title;
  titleDiv.className = "title";
  div.appendChild(titleDiv);

  const imgFlex = document.querySelector(".FlexWrapAlbums");
  imgFlex.appendChild(div);
}
