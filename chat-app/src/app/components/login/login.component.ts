import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) { 
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
  }


  onSubmit() {
    if(this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(res => {
        console.log(res);
        this.loginForm.reset();
        if(res.token) {
          this.router.navigateByUrl('/dashboard');
        }
      })
    }
  }

}
