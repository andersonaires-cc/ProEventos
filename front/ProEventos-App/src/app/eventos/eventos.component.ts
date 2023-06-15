import { Component } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent {
  public eventos: any = [
    {
      Tema : 'Angular 15',
      Local: 'Belo Horizonte'
    },
    {
      Tema : '.NET 5',
      Local: 'São Paulo'
    },
    {
      Tema : 'Angular e suas novidades',
      Local: 'Rio de Janeiro'
    }
  ]
}
