import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home'; 
import { CartComponent } from './cart/cart';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { RegisterComponent } from './register/register.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { MyOrdersComponent } from './my-orders/my-orders.component'; // पाथ सही चेक करें // ✅ Confirmed Import

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cart', component: CartComponent }, 
    { path: 'checkout', component: CheckoutComponent },
    { path: 'order-success', component: OrderSuccessComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin/products', component: AdminProductsComponent },
    { path: 'orders', component: MyOrdersComponent } // ✅ Confirmed Route
];