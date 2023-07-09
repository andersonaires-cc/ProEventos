import { Component } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
//   providers : [EventoService]
})
export class EventosComponent {
  
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem = true;
  private filtroListado = '';

  public get filtroLista(){
    return this.filtroListado;
  }
  public set filtroLista(value : string){
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroListado ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
        (evento:
            {local: any; tema: string;}) => 
                evento.tema.toLocaleLowerCase().indexOf(filtrarPor)!==-1
                ||
                evento.local.toLocaleLowerCase().indexOf(filtrarPor)!==-1
    )
  }
  
  constructor(private eventoService: EventoService){}

  public ngOnInit(): void{
    this.getEventos();
  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void{
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => console.log(error)
    });
  }
}
