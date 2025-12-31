import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // 👈 SweetAlert2 इम्पोर्ट करें

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 यहाँ सिर्फ मॉड्यूल्स रहेंगे
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {

  cart: any = null;
  grandTotal: number = 0;
  
  checkoutData = {
    fullName: '', // 👈 Backend DTO के हिसाब से
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'ONLINE' 
  };

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartSummary();
  }

  loadCartSummary() {
    this.cartService.getCart().subscribe({
      next: (data: any) => {
        if (data && data.cartItems) {
           this.cart = data;
           this.calculateTotal();
        }
      },
      error: (err) => console.error(err)
    });
  }

  calculateTotal() {
    this.grandTotal = 0;
    if (this.cart?.cartItems) {
      for(let item of this.cart.cartItems){
        this.grandTotal += (item.product.specialPrice * item.quantity);
      }
    }
  }

  placeOrder() {
    this.cartService.placeOrder(this.checkoutData).subscribe({
      next: (response: any) => {
        if (this.checkoutData.paymentMethod === 'ONLINE') {
          this.initiateRazorpay(response);
        } else {
          Swal.fire('Success', 'Order Placed Successfully!', 'success');
          this.router.navigate(['/order-success']);
        }
      },
      error: (err) => {
        // 🛑 स्टॉक एरर या अन्य एरर यहाँ पकड़े जाएंगे
        console.error("Order Failed:", err);
        
        let msg = "Order failed! Please try again.";
        if (typeof err.error === 'string') {
          msg = err.error; // जैसे: "Product TV is OUT OF STOCK!"
        }

        // 👈 सुंदर SweetAlert पॉप-अप दिखाएं
        Swal.fire({
          icon: 'error',
          title: 'Order Status',
          text: msg,
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  initiateRazorpay(order: any) {
    const options = {
      key: 'rzp_test_RpjVgDaher9T9K', 
      amount: order.totalAmount * 100, 
      currency: "INR",
      name: "My E-Store",
      description: "Payment for Order #" + order.orderId,
      order_id: order.razorpayOrderId, 
      handler: (res: any) => {
        Swal.fire('Paid!', 'Payment Successful', 'success');
        this.router.navigate(['/order-success']);
      },
      prefill: {
        name: localStorage.getItem('username'),
        email: this.checkoutData.email
      },
      theme: { color: "#3399cc" }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}