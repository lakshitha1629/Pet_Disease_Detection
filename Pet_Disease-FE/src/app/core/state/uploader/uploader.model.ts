export interface Uploader {
  id?: number;
  diseasePercentage?: number;
  whiteDotsCount?: number;
  yellowDotsCount?: number;
}

export function createUploader(params: Partial<Uploader>) {
  return {

  } as Uploader;
}
