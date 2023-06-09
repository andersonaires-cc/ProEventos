import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent  implements OnInit{
    @Input()
    titulo!: string;

    @Input() Titulo: string | undefined;
    @Input() iconClass = 'fa fa-user';
    @Input() subtitulo = 'Desde 2023';
    @Input() botaoListar = false;

    constructor(){}

    ngOnInit(): void {
        
    }
}
