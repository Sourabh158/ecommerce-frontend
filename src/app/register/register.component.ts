import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './register.component.html',
  styleUrl: './register.component.css' // CSS file ka naam check kar lena
})
// 👇 Class ka naam 'RegisterComponent' kar diya (Best Practice)
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // register.component.ts

onRegister() {
  if (this.name && this.email && this.password) {
    
    // Backend ko 'username' chahiye, 'name' nahi.
    const userData = {
      username: this.name,  // Yaha name ko username me daal diya
      email: this.email,
      password: this.password,
      role: []  // Ab role bhejne ki jarurat nahi hai, par format ke liye khaali bhej do
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        alert('Registration Successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Registration Failed!');
      }
    });
  }
}
}