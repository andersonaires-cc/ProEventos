import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit{
    public Palestrantes: Palestrante[] = [];
    public eventoId = 0;
    public pagination = {} as Pagination;
    
    constructor(
      private palestranteService: PalestranteService,
      private modalService: BsModalService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private router: Router
    ) {}

    public ngOnInit(): void {
        this.pagination = {
            currentPage: 1,
            itemsPerPage: 3,
            totalItems:2
        } as Pagination;

        this.carregarPalestrantes()
    }

    termoBuscarChanged: Subject<string> = new Subject<string>();


    public filtrarPalestrantes(evt: any): void{
        if(this.termoBuscarChanged.observers.length ==0){            
            this.termoBuscarChanged.pipe(debounceTime(1000)).subscribe(
                filtrarPor => {
                    this.spinner.show();
                    this.palestranteService.getPalestrantes(
                    this.pagination.currentPage,
                    this.pagination.itemsPerPage,
                    filtrarPor
                    ).subscribe(
                    {
                        next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
                                this.Palestrantes = paginatedResult.result;
                                this.pagination = paginatedResult.pagination;
                        },
                        error: (error: any) => {
                                this.spinner.hide();
                                this.toastr.error('Erro ao carregar os eventos','Error!')
                                },
                        complete : () => this.spinner.hide()
                    })
                }
            )
        }
        this.termoBuscarChanged.next(evt.value);  
    }

    public getImagemURL(imagemName: string): string{
        if(imagemName)
            return environment.apiURL + `resources/perfil/${imagemName}`;
        else
            return './assets/img/perfil.png';
    }

    public carregarPalestrantes(): void{
        this.spinner.show();
  
        this.palestranteService.getPalestrantes(this.pagination.currentPage,
                                       this.pagination.itemsPerPage).subscribe({
          next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
            this.Palestrantes = paginatedResult.result;
            this.pagination = paginatedResult.pagination;
          },
          error: (error: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao carregar os eventos','Error!')
          },
          complete : () => this.spinner.hide()
        });
      }
}
