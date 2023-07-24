import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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


        this.form = this.fb.group({
            titulo :['', Validators.required] ,
            primeiroNome:['', Validators.required] ,
            ultimoNome: ['', Validators.required],
            email:['', Validators.required] ,
            telefone:['', Validators.required] ,
            funcao:['', Validators.required] ,
            senha:['', Validators.required] ,
            confirmeSenha:['', Validators.required] ,
        })
    }
}
