import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mis-datos.html',
  styleUrls: ['./mis-datos.css']
})
export class MisDatosComponent implements OnInit {

  // Este objeto guardará la info del cliente
  usuario = {
    nombreCompleto: '',
    telefono: '',
    direccionDefecto: ''
  };

  constructor() { }

  ngOnInit(): void {
    // Aquí es donde Mike conectará el servicio HTTP para llamar al SP_ObtenerUsuario
    // Por ahora, le ponemos datos falsos para que veas que funciona la UI
    this.usuario = {
      nombreCompleto: 'Omar Ornelas',
      telefono: '4491112233',
      direccionDefecto: 'Av. Universidad, Aguascalientes'
    };
  }

  guardarDatos(): void {
    // Aquí mandaremos a llamar a SP_ActualizarUsuario
    console.log('Enviando datos al backend...', this.usuario);
    alert('¡Datos guardados con éxito!');
  }
}