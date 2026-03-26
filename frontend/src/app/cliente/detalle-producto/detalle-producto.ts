import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
})
export class DetalleProducto {
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
