import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  // shorten the code by using getters
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.getUserByEmail(email as string).subscribe(
      (response) => {
        if (response.length > 0 && response[0].password === password) {
          sessionStorage.setItem('email', email as string);
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'You have successfully logged in!',
          });
          this.router.navigate(['landing']); // logged in --> redirect to specific USER PAGE
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password',
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Something went wrong.',
        });
      }
    );
  }
}
