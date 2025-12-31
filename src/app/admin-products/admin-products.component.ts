import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  // --- Variables ---
  products: any[] = [];
  filteredProducts: any[] = []; // ✅ सर्च और फिल्टर के बाद दिखने वाली लिस्ट
  categories: any[] = [];
  
  searchTerm: string = ''; // ✅ सर्च इनपुट के लिए
  selectedFilterCategory: number = 0; // ✅ फिल्टर ड्रॉपडाउन के लिए

  newCategoryName: string = '';
  newProduct = { 
    productName: '', 
    image: '', 
    description: '', 
    quantity: 0, 
    price: 0, 
    discount: 0, 
    specialPrice: 0 
  };

  selectedCategoryId: number = 0;
  isEditMode: boolean = false;
  editingProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // --- Methods ---

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.applyFilters(); // ✅ डेटा लोड होते ही फिल्टर चलाएं
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error("Load Error:", err)
    });
  }

  // 🔥 मुख्य फिल्टर लॉजिक: सर्च और कैटेगरी दोनों को एक साथ चेक करता है
  applyFilters() {
    let temp = [...this.products];

    // 1. नाम के आधार पर सर्च करें
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(p => p.productName.toLowerCase().includes(term));
    }

    // 2. कैटेगरी के आधार पर फिल्टर करें
    if (this.selectedFilterCategory != 0) {
      temp = temp.filter(p => 
        p.category && (p.category.id == this.selectedFilterCategory || p.category.categoryId == this.selectedFilterCategory)
      );
    }

    this.filteredProducts = temp; // UI को अपडेट करने के लिए
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error("Category Load Error:", err)
    });
  }

  onAddCategory() {
    if (!this.newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }
    this.categoryService.createCategory({ name: this.newCategoryName }).subscribe({
      next: (res: any) => {
        alert("Category Added Successfully! ✅");
        this.newCategoryName = ''; 
        this.loadCategories();
      },
      error: (err: any) => {
        // Plain text response handle करने के लिए
        if (err.status === 201 || err.status === 200) {
          alert("Category Added Successfully! ✅");
          this.newCategoryName = '';
          this.loadCategories();
        } else {
          alert("Error adding category.");
        }
      }
    });
  }

  onSaveProduct() {
    if (this.isEditMode && this.editingProductId) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    if (this.selectedCategoryId === 0) {
      alert("Please select a category");
      return;
    }
    this.productService.addProduct(this.selectedCategoryId, this.newProduct).subscribe({
      next: (res: any) => {
        alert("Product Added Successfully! 💾");
        this.loadProducts();
        this.resetForm();
      },
      error: (err: any) => alert("Error adding product.")
    });
  }

  editProduct(product: any) {
    this.isEditMode = true;
    this.editingProductId = product.productId;
    this.newProduct = { ...product };
    this.selectedCategoryId = product.category ? (product.category.id || product.category.categoryId) : 0;
    window.scrollTo(0, 0);
  }

  updateProduct() {
    if (!this.editingProductId) return;
    this.productService.updateProduct(this.editingProductId, this.newProduct).subscribe({
      next: (res: any) => {
        alert("Product Updated Successfully! ✅");
        this.loadProducts();
        this.resetForm();
      },
      error: (err: any) => alert("Error updating product.")
    });
  }

  deleteProduct(productId: number) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(productId).subscribe({
        next: (res: any) => {
          alert("Product Deleted Successfully!");
          this.loadProducts();
        },
        error: (err: any) => alert("Error deleting product.")
      });
    }
  }

  resetForm() {
    this.newProduct = { productName: '', image: '', description: '', quantity: 0, price: 0, discount: 0, specialPrice: 0 };
    this.selectedCategoryId = 0;
    this.isEditMode = false;
    this.editingProductId = null;
  }
}