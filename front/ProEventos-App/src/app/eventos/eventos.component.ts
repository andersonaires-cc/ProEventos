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

  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public exibirImagem: boolean = true;
  private _filtroLista: string = '';

  public get filtroLista(){
    return this._filtroLista;
  }
  public set filtroLista(value : string){
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
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
    this.eventoService.getEventos().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
    },
      error => console.log(error)
    );

  }
}
