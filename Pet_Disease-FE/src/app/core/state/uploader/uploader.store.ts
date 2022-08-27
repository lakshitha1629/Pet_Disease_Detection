import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Uploader } from './uploader.model';

export interface UploaderState extends EntityState<Uploader> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'uploader', resettable: true })
export class UploaderStore extends EntityStore<UploaderState> {

  constructor() {
    super();
  }

}
