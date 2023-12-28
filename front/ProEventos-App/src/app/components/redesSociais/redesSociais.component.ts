import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RedeSocial } from '@app/models/RedeSocial';
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
    public eventoId = 0;
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
        private redeSocialService: RedeSocialService
    ) {}
        
    ngOnInit() {
        if(this.eventoId === 0){
            this.carregarRedeSocial('Palestrante')
        }
        this.validation();
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
        
    public salvarLotes(): void{
        if(this.formRS.valid){
            this.spinner.show();
            this.redeSocialService.saveLote(this.eventoId, this.formRS.value.lotes).subscribe(
                () => {
                    this.toastr.success('Lotes salvos com Sucesso!', 'Sucesso');
                },
                (error: any) => {
                    this.toastr.error('Erro ao tentar salvar lotes.','Erro');
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
        this.modalRef.hide();
        this.spinner.show();
        
        this.redeSocialService.deleteRedeSocial(this.eventoId, this.redeSocialAtual.id)
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
            