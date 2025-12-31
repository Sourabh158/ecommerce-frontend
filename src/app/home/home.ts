import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { CategoryService } from '../category.service'; // ✅ कैटेगरी के लिए
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ सर्च बाइंडिंग के लिए

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ FormsModule add kiya
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = []; // ✅ फिल्टर की हुई लिस्ट
  categories: any[] = [];
  searchTerm: string = ''; // ✅ सर्च बॉक्स के लिए
  selectedCategory: number = 0; // ✅ ड्रॉपडाउन फिल्टर के लिए

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService, // ✅ Inject CategoryService
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories(); // ✅ कैटेगरी लोड करें
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = Array.isArray(data) ? data : data.content;
        this.applyFilters(); // ✅ शुरू में फिल्टर अप्लाई करें
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error:", err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔥 सर्च और कैटेगरी फिल्टर का मुख्य लॉजिक
  applyFilters() {
    let temp = [...this.products];

    // 1. नाम से फिल्टर
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(p => p.productName.toLowerCase().includes(term));
    }

    // 2. कैटेगरी से फिल्टर
    if (this.selectedCategory != 0) {
      temp = temp.filter(p => p.category && (p.category.id == this.selectedCategory || p.category.categoryId == this.selectedCategory));
    }

    this.filteredProducts = temp;
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: (response) => {
        alert("✅ Product added to cart successfully!");
      },
      error: (err) => {
        alert("❌ Failed to add product. Please Login first.");
      }
    });
  }
}