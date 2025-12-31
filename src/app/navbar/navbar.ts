import { Component, OnInit, DoCheck } from '@angular/core'; // 👈 1. DoCheck जोड़ा
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, DoCheck { // 👈 2. DoCheck यहाँ भी जोड़ा

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  // 👈 3. यह नया फंक्शन हर बदलाव पर डेटा चेक करेगा (जैसे ही आप लॉगिन करेंगे)
  ngDoCheck(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('roles'); 
    this.username = localStorage.getItem('username');

    if (token) {
      this.isLoggedIn = true;
      
      // 👈 4. पक्का करें कि roles मौजूद है और उसमें ROLE_ADMIN लिखा है
      if (roles && roles.includes('ROLE_ADMIN')) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}