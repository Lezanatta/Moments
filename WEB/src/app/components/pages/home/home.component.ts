import { Component } from '@angular/core';
import { MomentService } from '../../../services/moment.service';
import { Moments } from '../../interfaces/Moments';
import { enviroment } from '../../../../enviroment';
import { faIcons, faSearch } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  allMoments: Moments[] = [];
  moments: Moments[] = [];
  baseApiUrl = enviroment.baseApiUrl;

  faSearch = faSearch;
  searchTerm: string = '';

  constructor(private momentService : MomentService) {}

  ngOnInit(): void{
    this.momentService.getMoments().subscribe((items) =>{
      const data = items.data
      data.map((item) =>{
        item.created_at = new Date(item.created_at!).toLocaleDateString('pt-BR')
      });

      this.allMoments = data
      this.moments = data
    });
  }

  search(event: Event) : void{

    const target = event.target as HTMLInputElement
    const value = target.value

    this.moments = this.allMoments.filter((moment) => {
      return moment.title.toLowerCase().includes(value)
    });
  }
}
