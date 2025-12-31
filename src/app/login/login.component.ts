import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onLogin() {
    if (this.username && this.password) {
      const loginData = {
        username: this.username,
        password: this.password
      };

      // अपनी AuthService के फंक्शन का नाम चेक करें (signin या login)
      this.authService.signin(loginData).subscribe({ 
        next: (res: any) => {
          alert("Login Successful!");
          
          // डेटा को LocalStorage में सेव करना
          localStorage.setItem('token', res.jwtToken);
          localStorage.setItem('username', res.username);
          
          // 'roles' को String बनाकर सेव करना सबसे ज़रूरी है
          if (res.roles) {
            localStorage.setItem('roles', JSON.stringify(res.roles));
          }
          
          // होम पेज पर नेविगेट करना
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error("Login Error:", err);
          alert("Login Failed! Please check your credentials.");
        }
      });
    } else {
      alert("Please enter both username and password.");
    }
  }
}