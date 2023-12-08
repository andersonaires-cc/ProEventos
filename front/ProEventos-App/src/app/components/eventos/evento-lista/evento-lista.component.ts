import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';


@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent  implements OnInit{
    modalRef?: BsModalRef;
    public eventos: Evento[] = [];
    public eventoId = 0;
    public pagination = {} as Pagination;
  
    public larguraImagem = 150;
    public margemImagem = 2;
    public exibirImagem = true;

  
    public filtrarEventos(evt: any): void{
      this.eventoService.getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            evt.value
            ).subscribe(
                {
                    next: (paginatedResult: PaginatedResult<Evento[]>) => {
                      this.eventos = paginatedResult.result;
                      this.pagination = paginatedResult.pagination;
                    },
                    error: (error: any) => {
                      this.spinner.hide();
                      this.toastr.error('Erro ao carregar os eventos','Error!')
                    },
                    complete : () => this.spinner.hide()
                  }
            )
    }
    
    constructor(
      private eventoService: EventoService,
      private modalService: BsModalService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private router: Router
    ){}
  
    public ngOnInit(): void{
      this.pagination = {
        currentPage: 1,
        itemsPerPage: 3,
        totalItems:2
    } as Pagination;
    
      this.carregarEventos();      
    }
  
    public alterarImagem(): void{
      this.exibirImagem = !this.exibirImagem;
    }

    public mostraImagem(imagemURL: string): string {
        return (imagemURL != '')
                ? `${environment.apiURL}Resources/images/${imagemURL}`
                : 'assets/semImagem.jpg'
    }
  
    public carregarEventos(): void{
      this.spinner.show();

      this.eventoService.getEventos(this.pagination.currentPage,
                                     this.pagination.itemsPerPage).subscribe({
        next: (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos','Error!')
        },
        complete : () => this.spinner.hide()
      });
    }
  
    openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
      event.stopPropagation();
      this.eventoId = eventoId;
      this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    public pageChanged(event: any): void{
        this.pagination.currentPage = event.page;
        this.carregarEventos();
    }
   
    confirm(): void {
      this.modalRef?.hide();
      this.spinner.show();

      this.eventoService.deleteEvento(this.eventoId).subscribe(
        (result: any) => {
            if(result.message === 'Deletado'){
                this.toastr.success('O Evento foi deletado com sucesso', 'Deletado!');
                this.carregarEventos();
            }
        },
        (error: any) => {
            this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}` ,'Erro');
            this.spinner.hide();
        },
      ).add(() => this.spinner.hide(),);
    }
   
    decline(): void {
      this.modalRef?.hide();
    }

    detalheEvento(id: number): void{
        this.router.navigate([`eventos/detalhe/${id}`]);
    }

 
}
