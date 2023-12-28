import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/validator-field';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

    public usuario = {} as UserUpdate;
    public imagemURL = '';
    public file: File; 
    form!: FormGroup;


    public get ehPalestrante(): boolean{
        return this.usuario.funcao === 'Palestrante';
    }

    constructor(private spinner: NgxSpinnerService,
                private toastr: ToastrService,
                private accountService: AccountService){}


    ngOnInit(): void {

    }

    public setFormValue(usuario: UserUpdate): void {
        this.usuario = usuario;
        if(this.usuario.imagemURL)
            this.imagemURL = environment.apiURL + `resources/perfil/${this.usuario.imagemURL}`;
        else
            this.imagemURL = './assets/images/perfil.png';
    }

    onFileChange(ev: any): void{
        const reader = new FileReader();

        this.file = ev.target.files[0];
        reader.onload = (event: any) => this.imagemURL = event.target.result;

        reader.readAsDataURL(this.file);

        this.uploadImagem();
    }


    private uploadImagem(): void {
        this.spinner.show();
        this.accountService
            .postUpload(this.file)
            .subscribe(
                () => this.toastr.success('Imagem atualizada com sucesso', 'Sucesso'),
                (error: any) =>{
                    this.toastr.error('Error ao fazer upload de imagem', 'Erro!'),
                    console.error(error);
                }
            ).add(() => this.spinner.hide());
    }

}
