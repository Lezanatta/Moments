import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MessagesService } from '../../services/messages.service';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  constructor(public messageService : MessagesService) { }

  faTimes = faTimes;
}
