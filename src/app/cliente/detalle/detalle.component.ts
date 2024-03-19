import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente : Cliente;
  titulo : string = "Detalle del cliente";
  fotoSeleccionada : File;
  progreso : number = 0;

  constructor(private clienteService : ClienteService,  public modalService :ModalService) { }

  ngOnInit(): void {

    /* Podemos omitir esta inicialización, ya que como es un modal, estamos pasando el cliente por medio del @Input()
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        })
      }
    });*/
  }
  seleccionarFoto(event){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    this.fotoSeleccionada = event.target.files[0];
    this.progreso=0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){

      swalWithBootstrapButtons.fire("Error Seleccionar imagen:", "El archivo debe ser tipo imagen", "error");
      this.fotoSeleccionada = null;
    }

  }

  subirFoto(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    if(!this.fotoSeleccionada){

      swalWithBootstrapButtons.fire("Error Upload:", "Debe seleccionar una foto", "error");

    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          //this.cliente = cliente;

          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100)
          }else if(event.type === HttpEventType.Response){
            let response : any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            swalWithBootstrapButtons.fire("La foto se ha subido correctamente", response.mensaje, 'success');
          }
        }
      );
    }

    
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
