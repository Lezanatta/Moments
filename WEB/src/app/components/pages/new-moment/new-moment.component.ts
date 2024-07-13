import { Component } from '@angular/core';
import { MomentFormComponent } from '../../moment-form/moment-form.component';
import { Moments } from '../../interfaces/Moments';
import { MomentService } from '../../../services/moment.service';
import { MessagesService } from '../../../services/messages.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-new-moment',
  standalone: true,
  imports: [MomentFormComponent],
  providers:[
    MomentService
  ],
  templateUrl: './new-moment.component.html',
  styleUrl: './new-moment.component.scss'
})

export class NewMomentComponent {

  btnText = 'Compartilhar';

  constructor(
    private momentService : MomentService,
    private messageService : MessagesService,
    private router : Router
  ) { }

  async createHandler(moment: Moments) {
    const formData = new FormData();

    formData.append('title', moment.title);
    formData.append('description', moment.description);

    if (moment.image) {
      formData.append('image', moment.image);
    }

    await this.momentService.createMoment(formData).subscribe({
      next: () =>{
        this.messageService.add("Momento adicionado com sucesso!");
        this.router.navigate(['/'])
      }
    });
  }
}
