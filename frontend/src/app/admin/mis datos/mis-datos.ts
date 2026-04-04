import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mis-datos.html',
  styleUrls: ['./mis-datos.css']
})
export class MisDatosComponent implements OnInit {
  private location = inject(Location); // <-- Inyectamos el servicio

  usuario = {
    nombreCompleto: '',
    telefono: '',
    direccionDefecto: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.usuario = {
      nombreCompleto: 'Omar Ornelas',
      telefono: '4491112233',
      direccionDefecto: 'Av. Universidad, Aguascalientes'
    };
  }

  regresar(): void {
    this.location.back();
  }

  guardarDatos(): void {
    console.log('Enviando datos al backend...', this.usuario);
    alert('¡Datos guardados con éxito!');
  }
}