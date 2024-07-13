import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Moments } from '../interfaces/Moments';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-moment-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, HttpClientModule],
  templateUrl: './moment-form.component.html',
  styleUrl: './moment-form.component.scss'
})
export class MomentFormComponent {
  @Output() onSubmit = new EventEmitter<Moments>();
  @Input() btnText!: string
  @Input() momentData: Moments | null = null;

  momentForm!: FormGroup;


  ngOnInit(): void{
    this.momentForm = new FormGroup({
      id: new FormControl(this.momentData ? this.momentData.id : '',),
      title: new FormControl(this.momentData ? this.momentData.title : '', [Validators.required]),
      description: new FormControl(this.momentData ? this.momentData.description : '', [Validators.required]),
      image: new FormControl('')
    });
  }

  get title(){
    return this.momentForm.get('title')!;
  }

  get description(){
    return this.momentForm.get('description')!;
  }

  onFileSelected(event: any){
    const file: File = event.target.files[0];

    this.momentForm.patchValue({image: file})
  }

  submit(){
    if(this.momentForm.invalid){
      return;
    }

    this.onSubmit.emit(this.momentForm.value);
  }
}
