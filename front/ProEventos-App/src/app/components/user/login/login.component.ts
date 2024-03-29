import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/identity/User';
import { AccountService } from '@app/services/account.service';
import { UserLogin } from '@app/models/identity/UserLogin';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model = {} as UserLogin;

    constructor(private accountService: AccountService,
                private router: Router,
                private toaster: ToastrService) {}

    ngOnInit(): void {}

    public login(): void{
        
        this.accountService.login(this.model).subscribe(
            {                
                next: () => {
                    console.log("tetse");
                    this.router.navigateByUrl('/dashboard'); 
                },
                error: (error: any) =>{
                    if(error.status === 401)
                        this.toaster.error('usuário ou senha inválidos');
                    else console.error(error);
                }
            }
        );
    }
}
