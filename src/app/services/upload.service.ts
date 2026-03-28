import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedData } from '../interfaces/paginate-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  uploadFile(file: File):Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData,{
      reportProgress: true,
      observe: 'events'
    });
  }

  getPaginatedData(page:number, limit:number = 10):Observable<PaginatedData>{

    let params = new HttpParams()
                     .set('page',page.toString())
                     .set('limit',limit.toString());
    return this.http.get<PaginatedData>(`${this.baseUrl}/data`,{params}) ;

  }


  clearServerData():Observable<any>{

    return this.http.delete(`${this.baseUrl}/clear`);

  }
  
}
