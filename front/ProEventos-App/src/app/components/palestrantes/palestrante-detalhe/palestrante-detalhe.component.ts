import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit{
    public form!: FormGroup;
    public situacaoDoForm = '';
    public corDaDescricao = '';
    
    constructor(
        private fb: FormBuilder,
        public palestranteService: PalestranteService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.validation();
        this.verificaForm();
        this.carregarPalestrante()
    }

    private validation(): void{
        this.form = this.fb.group({
            miniCurriculo: ['']
        })
    }

    private carregarPalestrante(): void{
        this.spinner.show();

        this.palestranteService
            .getPalestrante()
            .subscribe(
                (palestrante: Palestrante) => {
                    this.form.patchValue(palestrante);
                },
                (error: any) =>{
                    this.toastr.error('Erro ao carregar o palestrante', 'Erro')
                }
            )
    }

    public get f(): any{
        return this.form.controls;
    }

    private verificaForm(): void{
        this.form.valueChanges // Observable
            .pipe(
                map(() =>{
                    this.situacaoDoForm = 'Minicurriculo está sendo atualizado !';
                    this.corDaDescricao = 'text-warning';
                }),
                debounceTime(1000), //Segurar o estado do observable
                tap(() => this.spinner.show())
            )
            .subscribe(
                () =>{
                    this.palestranteService
                        .put({...this.form.value})
                        .subscribe(
                            () =>{
                                this.situacaoDoForm = 'Minicurriculo foi atualizado !'
                                this.corDaDescricao = 'text-success';

                                setTimeout(() => {
                                    this.situacaoDoForm = 'Minicurriculo foi carregado !'
                                    this.corDaDescricao = 'text-muted';
                                }, 2000);
                            },
                            () =>{
                                this.toastr.error('Error ao tentar atualizar palestrante', "Error");
                            }
                        ).add(() => this.spinner.hide())
                }
            );
    }
}
