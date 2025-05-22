import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements AfterViewInit {
  user = {
    email: '',
    password: '',
  };

  alertMessage = '';
  alertType = '';
  showAlert = false;

  constructor(private router: Router, private http: HttpClient) {}

  @ViewChild('emailInput') emailInput!: ElementRef;

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
  }

  onLogin() {
    this.http.post('http://localhost:5232/api/auth/login', this.user).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
         localStorage.setItem('userName', res.user.name); // store user's name
        this.showBootstrapAlert('Login successful!', 'success');
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      (err) => {
        const msg = err.error || 'Login failed';
        this.showBootstrapAlert(msg, 'danger');
      }
    );
  }

  showBootstrapAlert(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 2000);
  }

  resetForm() {
    this.user.email = '';
    this.user.password = '';

    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    });
  }
}
