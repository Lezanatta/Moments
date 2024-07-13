import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  message: string = '';

  constructor() { }

  add(messageParams: string){
    this.message = messageParams;

    setTimeout(() => {
      this.clear();
    }, 6000);

  }

  clear(){
    this.message = '';
  }

}
