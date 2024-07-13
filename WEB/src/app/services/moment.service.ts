import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroment';
import { Observable } from 'rxjs';
import { Moments } from '../components/interfaces/Moments';
import { Response } from '../components/interfaces/Response';

@Injectable({
  providedIn: 'root'
})
export class MomentService {
  private baseApiUrl = enviroment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}add`;

  constructor(private http: HttpClient) {}

  getMoments(): Observable<Response<Moments[]>>{
    return this.http.get<Response<Moments[]>>(this.baseApiUrl)
  }

  getMoment(id: number): Observable<Response<Moments>>{
    const url = `${this.baseApiUrl}${id}`;
    return this.http.get<Response<Moments>>(url)
  }

  createMoment(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrl, formData);
  }

  updateMoment(id: number, formData: FormData): Observable<FormData> {
    return this.http.put<FormData>(this.baseApiUrl, formData);
  }

  removeMoment(id: number){
    const url = `${this.baseApiUrl}${id}`;
    return this.http.delete(url)
  }
}
