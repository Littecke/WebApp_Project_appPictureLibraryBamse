import * as proto from "./picture-album-prototypes.js";
import * as tmpl from "./picture-album-templates.js";

class pictureLibrary {
  constructor() {
    this.albums = [{}];
  }

  findAlbumByTitle(title) {
    return this.albums.find(
      (album) => album.title.toLowerCase() === title.toLowerCase()
    );
  }

  findAlbumById(id) {
    return this.albums.find((album) => album.id === id);
  }

  static findPictureById(id, albums) {
    // albums.find((album) =>
    //   album.pictures.find((picture) => picture.id == id)
    // );

    for (const album of albums) {
      const pic = album.pictures.find((picture) => picture.id == id);

      if (pic) {
        return pic;
      }
    }
  }

  static findAlbumByPictureId(id, albums) {
    for (const album of albums) {
      if (album.pictures.find((picture) => picture.id === id)) {
        return album;
      }
    }
  }

  static createFromTemplate() {
    const library = new pictureLibrary();
    library.albums = tmpl.albumsTemplate.NASA();

    return library;
  }

  //used when reading from JSON
  static attachPrototypes(library) {
    for (const album of library.albums) {
      Object.setPrototypeOf(album, proto.prototypeAlbum);

      for (const picture of album.pictures) {
        Object.setPrototypeOf(picture, proto.prototypePicture);
      }
    }
  }
}

//debugging only
/*
const library = pictureLibrary.createFromTemplate();

console.group('list all albums and picture ');
console.log(`\Library have ${library.albums.length} albums(s):`);
for (const album of library.albums) {
    console.log('--- Album -----\n' + album);

    console.log(`\n${album.pictures.length} picture(s) in album:`)
    for (const picture of album.pictures) {
        console.log('\n' + picture);
    }
    console.log('---------------\n');
}
console.groupEnd();

console.group('find an album by title and id')

let album = library.findAlbumByTitle('galaxies');
console.log(`album ${album.title} with id: ${album.id} has ${album.pictures.length} pictures`);

album = library.findAlbumByTitle('nebulas');
console.log(`album ${album.title} with id: ${album.id} has ${album.pictures.length} pictures`);

album = library.findAlbumById(album.id);
console.log(`album ${album.title} with id: ${album.id} has ${album.pictures.length} pictures`);
console.groupEnd();
*/

export { pictureLibrary };
