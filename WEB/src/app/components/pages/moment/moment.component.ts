import { CommentService } from './../../../services/comment.service';
import { Component } from '@angular/core';
import { MomentService } from '../../../services/moment.service';
import { Moments } from '../../interfaces/Moments';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { enviroment } from '../../../../enviroment';
import { faTimes, faEdit, faI } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MessagesService } from '../../../services/messages.service';
import { Comment } from '../../interfaces/Comment';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [RouterLink, FaIconComponent, ReactiveFormsModule, NgIf],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.scss'
})
export class MomentComponent {
  moment?: Moments;
  baseApiUrl = enviroment.baseApiUrl;
  faTimes = faTimes;
  faEdit = faEdit;

  commentForm! : FormGroup;

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messageService: MessagesService,
    private router: Router,
    private commentService : CommentService
  ) { }

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService
    .getMoment(id)
    .subscribe((item) => (this.moment = item.data));

    this.commentForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required])
    })
  }

  get text(){
    return this.commentForm.get('text')!
  }

  get username(){
    return this.commentForm.get('username')!
  }

  async removeHandler(id : number){
    await this.momentService.removeMoment(id).subscribe(()=>{
      this.messageService.add('Momento excluído com sucesso.');

      this.router.navigate(['/']);
    });
  }

  async onSubmit(formDirective : FormGroupDirective){
    if(this.commentForm.invalid){
      return
    }

    const formData = new FormData();
    const data: Comment = this.commentForm.value
    data.momentId = Number(this.moment!.id)

    formData.append('text', data.text);
    formData.append('username', data.username);
    formData.append('moment_id', data.momentId.toString());

    await this.commentService.createComment(formData).subscribe((comment) => {

    this.messageService.add("Comentário adicionado!")

    this.commentForm.reset();

    formDirective.resetForm();
    })
  }
}
