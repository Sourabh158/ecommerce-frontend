import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Link kaam karne ke liye

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterModule], // ✅ Import zaroori hai
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent { 
  // Dhyan dein: Yahan naam 'OrderSuccessComponent' hona chahiye (Last me '2' nahi)
}