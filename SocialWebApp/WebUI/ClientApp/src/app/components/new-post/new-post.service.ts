import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewPostService {
  imageUrls: string[] = [];
  rawImageArray: File[] = [];

  constructor() {}

  addImages = () => {
    this.imageUrls = [];

    return new Promise(resolve => {
      this.rawImageArray.forEach(async file => {
        const reader = new FileReader();
        reader.readAsDataURL(file as File);

        reader.onload = () => {
          this.imageUrls.push(reader.result as string);
          resolve(true);
        };
      });
    });
  };

  getImages(): string[] {
    return this.imageUrls;
  }

  setRawImages(file: File) {
    this.rawImageArray.push(file);
  }

  getRawImages() {
    return this.rawImageArray;
  }

  emptyRawImages() {
    this.rawImageArray = [];
  }

  removeRawImages(name: string) {
    this.rawImageArray = this.rawImageArray.filter(current => current.name !== name);
  }

  clearStore() {
    this.imageUrls = [];
    this.rawImageArray = [];
  }
}
