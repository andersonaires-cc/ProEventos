import { Component } from '@angular/core';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
//   providers : [EventoService]
})
export class EventosComponent {
  
  public eventos: any = [];
  public eventosFiltrados: any = [];

  larguraImagem: number = 150;
  margemImagem: number = 2;
  exibirImagem: boolean = true;
  private _filtroLista: string = '';

  public get filtroLista(){
    return this._filtroLista;
  }
  public set filtroLista(value : string){
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any{
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

  ngOnInit(): void{
    this.getEventos();
  }

  alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void{
    this.eventoService.getEventos().subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;
    },
      error => console.log(error)
    );

  }
}
