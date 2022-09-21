//import * as proto from './picture-album-prototypes.js';
import { pictureLibraryBrowser } from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server

  // hämta alla slideshow-bilder från local storage
  const pictures = JSON.parse(localStorage.getItem("slideArray"));

  const buttons = document.querySelectorAll(".btn");
  const imgDiv = document.querySelector(".img-container");
  const titleDiv = document.querySelector(".title");
  const descDiv = document.querySelector(".desc");
  const albumTitleDiv = document.querySelector(".albumTitle");

  let counter = 0;

  // sätt den första bilden som bakgrund i slideshown
  setBackgroundImage(counter);

  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      if (event.target.classList.contains("btn-left")) {
        counter--;
        if (counter < 0) {
          counter = pictures.length - 1;
        }
      } else {
        counter++;
        if (counter > pictures.length - 1) {
          counter = 0;
        }
      }

      // sätt rätt bild som bakgrund i slideshowen
      setBackgroundImage(counter);
    });
  });

  function setBackgroundImage(index) {
    if (pictures.length <= 0) {
      return showMartin();
    }

    // hämta bildens index från slideshow-arrayen
    const id = pictures[index];

    const picture = pictureLibraryBrowser.findPictureById(id, library.albums);
    if (!picture) {
      return;
    }

    const album = pictureLibraryBrowser.findAlbumByPictureId(
      picture.id,
      library.albums
    );

    console.log("findade album by id", picture.id, album);

    if (!album) {
      return;
    }

    const bg = `url('${album.path}/${picture.imgHiRes}')`;

    console.log(bg);

    imgDiv.style.backgroundImage = bg;
    descDiv.innerText = picture.comment;
    titleDiv.innerText = picture.title;
    albumTitleDiv.innerText = album.title;
  }

  function showMartin() {
    imgDiv.style.backgroundImage = "";
    descDiv.innerText = "Du måste välja en bild till slideshown först.";
    titleDiv.innerText = "Hej Martin";
  }
});
