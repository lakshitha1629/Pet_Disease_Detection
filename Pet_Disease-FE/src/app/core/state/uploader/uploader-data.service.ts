import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Uploader } from "./uploader.model";
import { UploaderService } from "./uploader.service";
@Injectable({ providedIn: 'root' })
export class UploaderDataService {

  constructor(private httpClient: HttpClient) {
  }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(`${environment.apiUrl}getAIDetectionOutput`, formData, {
      reportProgress: true,
      responseType: 'json',
      observe: 'events'
    });
  }

  // upload(file: File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file);
  //   const request = new HttpRequest('POST', `${environment.apiUrl}getRatio`, formData, {
  // reportProgress: true,
  // responseType: 'json'
  //   });
  //   return this.httpClient.request(request);
  // }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}getAIDetectionOutput`);
  }

}


