import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/validator-field';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

    form!: FormGroup;

    constructor(public fb: FormBuilder){}

    get f(): any {return this.form.controls;}

    ngOnInit(): void {
        this.validation();
    }

    private validation(): void{

        const formOptions: AbstractControlOptions ={
            validators: ValidatorField.MustMatch('senha','confirmeSenha')
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
            senha:['', 
                [Validators.required, Validators.minLength(6)]
            ],
            confirmeSenha:['', Validators.required] ,
        }, formOptions);
    }
}
