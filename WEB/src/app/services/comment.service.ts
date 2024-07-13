import { Comment } from './../components/interfaces/Comment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../enviroment';
import { Response } from '../components/interfaces/Response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseApiUrl = enviroment.baseApiUrl
  private apiUrl = `${this.baseApiUrl}comment`

  constructor(private http: HttpClient) { }

  createComment(data: FormData) : Observable<Response<FormData>>{
    return this.http.post<Response<FormData>>(this.apiUrl, data);
  }
}
