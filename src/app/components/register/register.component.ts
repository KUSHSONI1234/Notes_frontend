import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  standalone: true,
})
export class RegisterComponent implements AfterViewInit {
  user = {
    name: '',
    email: '',
    password: '',
  };

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  @ViewChild('nameInput') nameInput!: ElementRef;

  ngAfterViewInit() {
    this.nameInput.nativeElement.focus();
  }

  onSubmit() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.showBootstrapAlert('Please fill out all fields.', 'danger');
      return;
    }

    this.http
      .post('http://localhost:5232/api/auth/register', this.user)
      .subscribe(
        (res: any) => {
          this.showBootstrapAlert('User registered successfully!', 'success');

          // Delay navigation by 2 seconds
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);

          this.resetBtn();
        },
        (err) => {
          const msg = err.error || 'Something went wrong.';
          if (msg === 'User already exists.') {
            this.showBootstrapAlert(
              'User already exists. Try logging in.',
              'danger'
            );
          } else {
            this.showBootstrapAlert(msg, 'danger');
          }
        }
      );
  }

  resetBtn() {
    this.user = { name: '', email: '', password: '' };
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    });
  }

  showBootstrapAlert(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Auto-hide after 3 seconds
  }
}
