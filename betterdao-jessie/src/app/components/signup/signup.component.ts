import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm = this.fb.group(
    {
      fullName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z ]+(?: [a-zA-Z]+)*$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}
  // shorten the code by using getters
  get fullName() {
    return this.signupForm.controls['fullName'];
  }
  get email() {
    return this.signupForm.controls['email'];
  }
  get password() {
    return this.signupForm.controls['password'];
  }
  get confirmPassword() {
    return this.signupForm.controls['confirmPassword'];
  }
  submitDetails() {
    const postData = { ...this.signupForm.value };
    delete postData.confirmPassword;
    this.authService.registerUser(postData as User).subscribe(
      (response) => {
        console.log(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'You have successfully registered!',
        });
        this.router.navigate(['login']);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: 'Registration failed. Please try again!',
        });
      }
    );
  }
}
