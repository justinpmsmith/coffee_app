import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {
  products: any[] = [];

  constructor(
    private router: Router,
    private userPreferencesService: UserPreferencesService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Mock data for now - we'll connect to database service later
    this.products = [
      {
        barcode: '5449000011115',
        flavor_name: 'RISTRETTO',
        image_path: 'assets/images/products/risetto.png'
      },
      {
        barcode: '5449000011116', 
        flavor_name: 'RISTRETTO INTENSO',
        image_path: 'assets/images/products/risettoIntenso.png'
      }
    ];
  }

  onSyncClick() {
    console.log('Sync clicked');
    // TODO: Implement sync functionality
  }

  onAddClick() {
    console.log('Add product clicked');
    this.router.navigate(['/product-form']);
  }

  onEditProduct(product: any) {
    console.log('Edit product:', product);
    this.router.navigate(['/product-form'], { queryParams: { barcode: product.barcode } });
  }

  onDeleteProduct(product: any) {
    console.log('Delete product:', product);
    // TODO: Implement delete confirmation modal
  }

  async onLogout() {
    await this.userPreferencesService.logout();
    this.router.navigate(['/login']);
  }
}