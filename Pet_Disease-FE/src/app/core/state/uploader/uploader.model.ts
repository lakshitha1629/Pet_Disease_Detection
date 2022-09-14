export interface Uploader {
  id?: number;
  diseasePercentage?: number;
  prediction?: string;
}

export function createUploader(params: Partial<Uploader>) {
  return {

  } as Uploader;
}
