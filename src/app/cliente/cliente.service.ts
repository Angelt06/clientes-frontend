import { Injectable } from '@angular/core';
import {  catchError, map, Observable, tap, throwError } from 'rxjs';
import { Cliente } from './cliente';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint : string = "http://localhost:8080/api/clientes";
  private httpHeaders : HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient : HttpClient, private router : Router){}

  getRegiones(): Observable<Region[]>{

    return this.httpClient.get<Region[]>(this.urlEndpoint + '/regiones');
  }
 
  getClientes(page : number): Observable<any>{

    // return this.httpClient.get<Cliente[]>(this.urlEndpoint); 

    return this.httpClient.get(this.urlEndpoint + '/page/' + page).pipe(
      tap((response : any)=>{
        (response.content as Cliente[]).forEach(cliente => {

          console.log(cliente.nombre); // Este tap es parecido al map, pero no cambia el valor de respuesta ya que no retorna nada, por tanto es más para mostrar valores. Solo se usa en este caaso para el ejemplo, pero podemos omitirlo y mostrar los nombres por consola, desde el map también.
          
        });
      }),
      map((response : any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase(); 
          
          //let datePipe = new DatePipe('es');
          //cliente.fecha = datePipe.transform(cliente.fecha, 'EEEE dd, MMMM yyyy'); // Podemos poner cualquier formato de fecha.
          //formatDate(cliente.fecha, 'dd-MM-yyyy', 'en-US');  //Esta es otra forma sin utilizar los pipes.
          return cliente;
        });
        return response;
      }) 
      ); //Esta es otra forma de hacer el return itpo cliente con un pipe y un map que convierte response a Cliente[]
  }

  create(cliente : Cliente) :Observable<Cliente>{

    return this.httpClient.post<Cliente>(this.urlEndpoint, cliente, {headers: this.httpHeaders} ).pipe(

      // map((response : any) => response.cliente as Cliente),  con esta forma convertimos la respuesta del backend tipo object a un tipo Cliente.   para esto debemos quitar el Cliente del post así: httpClient.post(this.urlEndpoint...etc)
      catchError(e=>{

        if(e.status == 400) { 
          return throwError( () => e ); //Este if para capturar los errores de las validaciones de campos del backend.
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return  throwError( () => e );
      })
    );; //el cabecero headers se puede omitir en este caso ya que el contento type por defecto es de tipo application/json
  }

  getCliente(id : number) : Observable<Cliente>{
    return this.httpClient.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(

      catchError(e=>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('error al editar', e.error.mensaje, 'error');
        return  throwError( () => e );
      })
    );
  } 

  update(cliente : Cliente) : Observable<Cliente>{

    return this.httpClient.put(`${this.urlEndpoint}/${cliente.id}`, cliente).pipe(

      map((response : any) => response.cliente as Cliente), //el map para obtener el cliente desde el backend, ya que era tipo object se debe convertir a tipo Cliente.
      catchError(e=>{

        if(e.status == 400) { 
          return throwError( () => e ); 
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return  throwError( () => e );
      })
    );
  }

  delete(id : number) : Observable<Cliente>{
    
    return this.httpClient.delete<Cliente>(`${this.urlEndpoint}/${id}`).pipe(

      catchError(e=>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return  throwError( () => e );
      })
    );
  }

  /*  Este metodo funciona y devuelve un Cliente, que cnvertimos desde el HttpResponse
  subirFoto(archivo : File, id): Observable<Cliente>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    return this.httpClient.post(`${this.urlEndpoint}/upload`, formData).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e=>{
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return  throwError( () => e );
      })
    );
  } */

  //Acá como queremos una barra progreso necesitamos retornar un HttpEvent
  subirFoto(archivo : File, id): Observable<HttpEvent<{}>>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
      reportProgress: true
    });
    
    return this.httpClient.request(req);
  }
}
