import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 ChangeDetectorRef जोड़ें
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef // 👈 Constructor में inject करें
  ) {}

  ngOnInit(): void {
    this.cartService.getUserOrders().subscribe({
      next: (data: any) => {
        console.log("Orders received:", data); //
        this.orders = data;
        this.loading = false; // 👈 स्पिनर बंद करने के लिए
        
        // 🔥 सबसे ज़रूरी लाइन: Angular को स्क्रीन अपडेट करने के लिए मजबूर करें
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error("Orders load failed", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}