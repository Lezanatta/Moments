import { Moments } from './../../interfaces/Moments';
import { Component } from '@angular/core';
import { MomentService } from '../../../services/moment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MomentFormComponent } from '../../moment-form/moment-form.component';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-edit-moment',
  standalone: true,
  imports: [MomentFormComponent],
  templateUrl: './edit-moment.component.html',
  styleUrl: './edit-moment.component.scss'
})
export class EditMomentComponent {

  moment!: Moments;
  btnText: string = 'Editar';

  constructor(
    private momentService: MomentService,
    private route : ActivatedRoute,
    private messageService : MessagesService,
    private router : Router
  ) { }

  ngOnInit(): void{
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.momentService.getMoment(id).subscribe((item => {
      this.moment = item.data
    }))
  }

  async editHandler(momentData: Moments){
    const id = this.moment.id;

    const formData = new FormData();

    formData.append('title', momentData.title);
    formData.append('description', momentData.description);

    if(momentData.image){
      formData.append('image', momentData.image);
    }

    formData.append('id', id!.toString());

    await this.momentService.updateMoment(id!, formData).subscribe(() => {
      this.messageService.add("Momento Editado com sucesso!");

      this.router.navigate(['/']);
    });
  }
}
