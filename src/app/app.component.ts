import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 👇 Navbar Import (Zaroori hai)
import { NavbarComponent } from './navbar/navbar'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 👇 Navbar ko register kiya
  imports: [RouterOutlet, NavbarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My E-Store';
}