import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup


  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) { 
    
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    if(this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe(res => {
        console.log('register component response', res);
        this.registerForm.reset();
        if(res.token) {
          this.router.navigateByUrl('/dashboard');
        } 
      })
      // console.log('valid form submission', this.registerForm);
    } else {
      console.log('invalid form submission', this.registerForm);
    }
    
    
  }

}
