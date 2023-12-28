import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RedeSocial } from '@app/models/RedeSocial';
import { RedeSocialServiceService } from '@app/services/redeSocial.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-redesSociais',
    templateUrl: './redesSociais.component.html',
    styleUrls: ['./redesSociais.component.scss']
})
export class RedesSociaisComponent implements OnInit{
    
    modalRef: BsModalRef;
    @Input() eventoId = 0;
    public formRS: FormGroup;
    public redeSocialAtual = {id:0, nome: '', indice: 0};
    
    public get redesSociais(): FormArray{
        return this.formRS.get('redesSociais') as FormArray
    }
    
    constructor(
        private fb: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private redeSocialService: RedeSocialServiceService
    ) {}
        
    ngOnInit() {
        if(this.eventoId === 0){
            this.carregarRedesSociais('Palestrante')
        }
        this.validation();
    }

    private carregarRedesSociais(origem: string, id: number=0): void{
        this.spinner.show();

        this.redeSocialService
            .getRedesSociais(origem,id)
            .subscribe(
                (redeSocialRetorno: RedeSocial[]) => {
                    redeSocialRetorno.forEach((redeSocial) => {
                        this.redesSociais.push(this.criarRedeSocial(redeSocial))
                    });
                },
                (error: any) => {
                    this.toastr.error('Erro ao tentar carregar Rede Social', 'Erro');
                    console.error(error);
                }
            ).add(() => this.spinner.hide());
    }
        
    public validation(): void{
        this.formRS = this.fb.group({
            redesSociais: this.fb.array([])
        })
    }
    
    adicionarRedeSocial(): void {
        (this.redesSociais).push(this.criarRedeSocial({id: 0} as RedeSocial));
    }
        
    criarRedeSocial(redeSocial: RedeSocial): FormGroup {
        return this.fb.group({
            id:[redeSocial.id],
            nome:[redeSocial.nome , Validators.required],
            url: [redeSocial.url, Validators.required]
        })
    }
    
    public retornaTitulo(nome: string): string {
        return nome === null || nome == '' ? 'Rede social': nome;
    }

    public cssValidator(campoForm: FormControl | AbstractControl | null): any {
        return {'is-invalid': campoForm?.errors && campoForm.touched};
    }
        
    public salvarRedesSociais(): void{
        let origem = 'palestrante';

        if(this.eventoId != 0) origem = 'evento';

        if(this.formRS.valid){
            this.spinner.show();
            this.redeSocialService.saveRedesSociais(origem,this.eventoId, this.formRS.value.redesSociais).subscribe(
                () => {
                    this.toastr.success('Redes Sociais foram salvas com Sucesso!', 'Sucesso');
                },
                (error: any) => {
                    this.toastr.error('Erro ao tentar salvar Redes Sociaisk.','Erro');
                    console.error(error);
                }
            ).add(() => this.spinner.hide());
        }
    }
        
    public removerRedeSocial(template: TemplateRef<any>,indice: number): void{
        
        this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')?.value;
        this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')?.value;
        this.redeSocialAtual.indice = indice;
        
        this.modalRef = this.modalService.show(template,{class: ' modal-sm '});        
    }
    
    confirmDeleteRedeSocial():void {
        let origem = 'palestrante';
        this.modalRef.hide();
        this.spinner.show();
        
        if(this.eventoId != 0) origem = 'evento';
        
        this.redeSocialService.deleteRedeSocial(origem,this.eventoId, this.redeSocialAtual.id)
        .subscribe(
            () => {
                this.toastr.success('Rede Social deleta do com sucesso', 'Sucesso');
                this.redesSociais.removeAt(this.redeSocialAtual.indice);
            },
            (error: any) => {
                this.toastr.error(`Erro ao tentar deletar rede social ${this.redeSocialAtual.id}`, 'Erro');
                console.error(error);
            }
            ).add(() => this.spinner.hide());
    }

    declineDeleteRedeSocial(): void {
        this.modalRef.hide();
    }
    
            
}
            