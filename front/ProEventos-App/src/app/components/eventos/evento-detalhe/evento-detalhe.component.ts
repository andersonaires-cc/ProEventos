import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit{
    
    evento = {} as Evento;

    form: FormGroup;

    estadoSalvar = 'post';

    get modoEditar(): boolean{
        return this.estadoSalvar === 'put';
    }

    get lotes(): FormArray{
        return this.form.get('lotes') as FormArray
    }

    get f(): any{
        return this.form.controls;
    }

    get bsConfig(): any {
        return{
            isAnimated: true,
            adaptivePosition: true,
            dateInputFormat: 'DD/MM/YYYY hh:mm a',
            containerClass: 'theme-default',
            showWeekNumbers: false
        };
    }

    constructor(private fb: FormBuilder,
                private localeService: BsLocaleService,
                private activatedRouter: ActivatedRoute,
                private eventoService: EventoService,
                private spinner: NgxSpinnerService,
                private toastr: ToastrService,
                private router: Router)
    {
        this.localeService.use('pt-br');
    }

    public carregarEvento(): void{
        const eventoIdParam = this.activatedRouter.snapshot.paramMap.get('id');

        if(eventoIdParam!=null ){
            this.spinner.show();

            this.estadoSalvar = 'put';

            this.eventoService.getEventoById(+eventoIdParam).subscribe(
                (evento: Evento) => {
                    this.evento = {...evento};
                    this.form.patchValue(this.evento);
                },
                (error: any) => {
                    this.spinner.hide();
                    this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
                    console.error(error);
                },
                () => this.spinner.hide(),
            )
        };
    }

    ngOnInit(): void {
        this.carregarEvento();
        this.validation();
    }

    public validation(): void{
        this.form! = this.fb.group({
            tema: ['', 
                [Validators.required, Validators.minLength(4), 
                    Validators.maxLength(50)]
            ],
            local: ['', Validators.required],
            dataEvento: ['', Validators.required],
            qtdPessoas: ['', 
                [Validators.required, Validators.max(120000)]
            ],
            imagemURL: ['', Validators.required],
            telefone: ['', Validators.required],
            email: ['', 
                [Validators.required, Validators.email]
            ],
            lotes : this.fb.array([])
        });
    }

    adicionarLote(): void {
        (this.lotes).push(this.criarLote({id: 0} as Lote));
    }

    criarLote(lote: Lote): FormGroup {
        return this.fb.group({
            id:[lote.id],
            nome:[lote.nome , Validators.required],
            quantidade:[lote.quantidade, Validators.required],
            preco:[lote.preco, Validators.required],
            dataInicio:[lote.dataInicio],
            dataFinal:[lote.dataFinal]
        })
    }

    resetForm(): void{
        this.form.reset();
    }

    public cssValidator(campoForm: FormControl | AbstractControl | null): any {
        return {'is-invalid': campoForm?.errors && campoForm.touched};
    }
    public salvarAlteracao(): void{
        this.spinner.show();
        if(this.form.valid){

            this.evento = (this.estadoSalvar === 'post')
                    ? {...this.form.value}
                    : {id: this.evento.id, ...this.form.value};

            this.eventoService['post'](this.evento).subscribe(
                (eventoRetorno: Evento) =>{
                    this.toastr.success('Evento salvo com Sucesso', 'Sucesso');
                    this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
                },
                (error: any) =>{
                    console.error(error);
                    this.spinner.hide();
                    this.toastr.error('Erro ao salvar evento', 'Evento');
                },
                () => this.spinner.hide()
            );
        }   
    }

}
