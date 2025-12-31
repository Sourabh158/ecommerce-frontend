import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // 👈 Router import sahi hai

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  cart: any = null;
  grandTotal: number = 0; 
  errorMessage: string = '';

  constructor(
    private cartService: CartService, 
    private cdr: ChangeDetectorRef,
    private router: Router // 👈 Router inject sahi hai
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data: any) => {
        //
        if (data && data.cartItems) {
           this.cart = data;
        }
        else if (data && data.cartItemId) {
           this.cart = {
             cartItems: [data], 
             totalPrice: 0 
           };
        } else {
           this.cart = { cartItems: [] }; // Safety for empty cart
        }
        
        this.calculateTotal(); 
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Cart Error:", err);
        this.errorMessage = "Failed to load Cart. Please Login again.";
      }
    });
  }

  // Calculate Accurate Grand Total
  calculateTotal() {
    this.grandTotal = 0;
    if (this.cart && this.cart.cartItems) {
      for (let item of this.cart.cartItems) {
        this.grandTotal += (item.product.specialPrice * item.quantity);
      }
    }
  }

  removeItem(productId: number) {
    if(confirm("Are you sure you want to remove this item?")) {
      this.cartService.removeFromCart(productId).subscribe({
        next: () => {
          this.loadCart(); 
        },
        error: (err: any) => alert("Failed to remove item.")
      });
    }
  }

  updateQuantity(productId: number, quantity: number) {
    if(quantity < 1) return; 
    
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err: any) => alert("Could not update quantity")
    });
  }

  // 👈 Checkout Page पर जाने के लिए फंक्शन
  goToCheckout() {
    if (this.cart && this.cart.cartItems && this.cart.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      alert("Your cart is empty!");
    }
  }

  // 👈 My Orders Page पर जाने के लिए नया फंक्शन
  viewMyOrders() {
    this.router.navigate(['/orders']);
  }
}