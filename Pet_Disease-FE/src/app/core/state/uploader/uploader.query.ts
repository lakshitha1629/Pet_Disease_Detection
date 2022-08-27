import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Uploader } from './uploader.model';
import { UploaderStore, UploaderState } from './uploader.store';

@Injectable({ providedIn: 'root' })
export class UploaderQuery extends QueryEntity<UploaderState, Uploader> {

  constructor(protected store: UploaderStore) {
    super(store);
  }

}
