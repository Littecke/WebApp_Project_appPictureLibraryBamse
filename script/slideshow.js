//import * as proto from './picture-album-prototypes.js';
import { pictureLibraryBrowser } from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server

  // get all slideshow-images from local storage
  const pictures = JSON.parse(localStorage.getItem("slideArray"));

  // create button related to slideshow
  const buttons = document.querySelectorAll(".btn");
  const imgDiv = document.querySelector(".img-container");
  const titleDiv = document.querySelector(".title");
  const descDiv = document.querySelector(".desc");
  const albumTitleDiv = document.querySelector(".albumTitle");

  let counter = 0;

  // set first image as background in slideshow
  setBackgroundImage(counter);

  // event listener for prev/next buttons
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

      // sets current image as background in slideshow
      setBackgroundImage(counter);
    });
  });

  // if no image in slideshow - show message from showMarting function
  function setBackgroundImage(index) {
    if (pictures.length <= 0) {
      return showMartin();
    }

    const id = pictures[index];

    // find the picture from pictureid
    const picture = pictureLibraryBrowser.findPictureById(id, library.albums);

    // if there's no picture with that id, return
    if (!picture) {
      return;
    }

    // get index of image from slideshow array
    const album = pictureLibraryBrowser.findAlbumByPictureId(
      picture.id,
      library.albums
    );

    // if no album exists return
    if (!album) {
      return;
    }

    // create full path to picture
    const bg = `url('${album.path}/${picture.imgHiRes}')`;

    // ... set the current image to background with title, comment
    imgDiv.style.backgroundImage = bg;
    descDiv.innerText = picture.comment;
    titleDiv.innerText = picture.title;
    albumTitleDiv.innerText = album.title;
  }

  // message to show when no images to show
  function showMartin() {
    imgDiv.style.backgroundImage = "";
    descDiv.innerText = "Du måste välja en bild till slideshown först.";
    titleDiv.innerText = "Hej Martin";
  }
});
