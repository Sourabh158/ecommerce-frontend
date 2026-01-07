import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
import { CloudinaryService } from '../services/cloudinary.service'; // ✅ नया इम्पोर्ट

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  
  searchTerm: string = '';
  selectedFilterCategory: number = 0;

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
  isUploading: boolean = false; // ✅ अपलोडिंग इंडिकेटर के लिए

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService, // ✅ सर्विस यहाँ जोड़ दी है
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // ✅ इमेज को Cloudinary पर अपलोड करने का फंक्शन
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (res) => {
          this.newProduct.image = res.secure_url; // Cloudinary से मिला लिंक सेव करें
          this.isUploading = false;
          alert("Image Uploaded Successfully! ✅");
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.isUploading = false;
          alert("Image Upload Failed! ❌");
        }
      });
    }
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error("Load Error:", err)
    });
  }

  applyFilters() {
    let temp = [...this.products];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(p => p.productName.toLowerCase().includes(term));
    }
    if (this.selectedFilterCategory != 0) {
      temp = temp.filter(p => 
        p.category && (p.category.id == this.selectedFilterCategory || p.category.categoryId == this.selectedFilterCategory)
      );
    }
    this.filteredProducts = temp;
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