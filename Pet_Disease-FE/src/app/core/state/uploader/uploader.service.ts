import { Inject, Injectable } from '@angular/core';
import { Uploader } from './uploader.model';
import { UploaderStore, UploaderState } from './uploader.store';

@Injectable({ providedIn: 'root' })
export class UploaderService {

  constructor(@Inject('persistStorage') private persistStorage, protected uploaderStore: UploaderStore) {
  }

  addUploaderItem(uploaderItem: Uploader) {
    this.uploaderStore.add(uploaderItem);
  }

  deleteUploaderItem(id: number) {
    this.uploaderStore.remove(id);
    this.persistStorage.clearStore('uploader');
  }

}
