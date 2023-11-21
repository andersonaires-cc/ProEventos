import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/validator-field';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

    userUpdate = {} as UserUpdate;
    form!: FormGroup;

    constructor(
                private fb: FormBuilder,
                public accountService: AccountService,
                private router: Router,
                private toaster: ToastrService,
                private spinner: NgxSpinnerService
    ){}

    get f(): any {return this.form.controls;}

    ngOnInit(): void {
        this.validation();
        this.carregarUsuario();
    }

    private carregarUsuario(): void {
        this.spinner.show();
        this.accountService.getUser().subscribe(
            (userRetorno: UserUpdate) => {
                console.log(userRetorno)
                this.userUpdate = userRetorno;
                this.form.patchValue(this.userUpdate);
                this.toaster.success('Usuário Carregado', 'Sucesso');
            },
            (error) => {
                console.error(error);
                this.toaster.error('Usuário não carregado', 'Erro');
                this.router.navigate(['/dashboard'])
            },
            // () => this.spinner.hide()
        )
        .add(() => this.spinner.hide());
    }

    private validation(): void{

        const formOptions: AbstractControlOptions ={
            validators: ValidatorField.MustMatch('password','confirmePassword')
        };
        
        this.form = this.fb.group({
            titulo :['', Validators.required] ,
            primeiroNome:['', Validators.required] ,
            ultimoNome: ['', Validators.required],
            email:['', 
                Validators.required, Validators.email
            ],
            telefone:['', Validators.required] ,
            funcao:['', Validators.required] ,
            password:['', 
                [Validators.required, Validators.minLength(4)]
            ],
            confirmePassword:['', Validators.required] ,
        }, formOptions);
    }

    onSubmit(): void{
        this.atualizarUsuario();
    }

    public atualizarUsuario(){
        this.userUpdate = {...this.form.value}
        this.spinner.show();

        this.accountService.updateUser(this.userUpdate).subscribe(
            () => this.toaster.success('Usuário atualizado!', 'Sucesso'),
            (error) => {
                this.toaster.error(error.error);
                console.error(error);
            },
        )
        .add(()=> this.spinner.hide())
    }

    public resetForm(event: any): void{
        event.preventDefault();
        this.form.reset();
    }
}
