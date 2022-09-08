//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  console.log(library);

  const counter = document.querySelector("#counter");
  counter.innerHTML = library.albums.length;

  for (const album of library.albums) {
    renderAlbumImage(album);

    for (const picture of album.pictures) {
      //  renderImage(`${album.path}/${picture.imgLoRes}`, picture.id);
      //  renderImage(`${album.path}/${picture.imgHiRes}`, picture.id);
    }
  }
});

function showAlbum(album) {
  console.log("clickkk");
  console.log(album);

  const imgFlex = document.querySelector(".FlexWrapImages");
  imgFlex.innerHTML = "";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = album.title;
  titleDiv.className = "album-title";

  imgFlex.appendChild(titleDiv);

  for (const picture of album.pictures) {
    renderImage(picture, album);
    // renderImage(`${album.path}/${picture.imgHiRes}`, picture.id);
  }
}

function showImage() {
  // klicka på en bild
  // visa den i fullscreen
}

//Render the images
function renderImage(picture, album) {
  console.log("COMMEnT:", picture.comment);
  const url = `${album.path}/${picture.imgLoRes}`;
  console.log(picture);
  const flexItemDiv = document.createElement("div");
  flexItemDiv.className = `pictureWrapper FlexItem`;
  flexItemDiv.dataset.pictureId = picture.id;

  const img = document.createElement("img");
  img.src = url;
  flexItemDiv.appendChild(img);

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = picture.title;
  titleDiv.className = "title";

  flexItemDiv.appendChild(titleDiv);

  const commentDiv = document.createElement("div");
  commentDiv.innerHTML = picture.comment;
  commentDiv.className = "comment";

  flexItemDiv.appendChild(commentDiv);

  const imgFlex = document.querySelector(".FlexWrapImages");
  imgFlex.appendChild(flexItemDiv);

  const ratingDiv = document.createElement("div");
  ratingDiv.className = "rating";
  flexItemDiv.appendChild(ratingDiv);

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const star = createStar(i);
    ratingDiv.appendChild(star);
  }
}

function createStar(index) {
  const starTemplate = document.createElement("div");
  starTemplate.className = "star fa fa-star";
  starTemplate.dataset.rating = index;

  starTemplate.addEventListener("click", (event) => {
    setRating(event.target);
  });

  return starTemplate;
}

function setRating(starElement) {
  console.log(starElement.dataset.rating);

  // Värde mellan 1-5
  let rating = starElement.dataset.rating;

  const ratingElement = starElement.closest(".rating");

  const starElements = ratingElement.querySelectorAll(".star");

  if (ratingElement.dataset.rating == rating) {
    rating = 0;
  }

  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      starElements[i].classList.add("checked");
    } else {
      starElements[i].classList.remove("checked");
    }
  }

  ratingElement.dataset.rating = rating;
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
