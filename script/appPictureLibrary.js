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
  titleDiv.className = "title";
  imgFlex.appendChild(titleDiv);

  for (const picture of album.pictures) {
    renderImage(`${album.path}/${picture.imgLoRes}`, picture.id);
    // renderImage(`${album.path}/${picture.imgHiRes}`, picture.id);
  }
}

function showImage() {
  // klicka på en bild
  // visa den i fullscreen
}

//Render the images
function renderImage(src, tag) {
  const div = document.createElement("div");
  div.className = `FlexItem`;
  div.dataset.albumId = tag;

  const img = document.createElement("img");
  img.src = src;
  div.appendChild(img);

  const imgFlex = document.querySelector(".FlexWrapImages");
  imgFlex.appendChild(div);
}

//Render the images
function renderAlbumImage(album) {
  const src = album.headerImage;
  const tag = album.id;
  const title = album.title;

  const div = document.createElement("div");
  div.className = `FlexItem`;
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
