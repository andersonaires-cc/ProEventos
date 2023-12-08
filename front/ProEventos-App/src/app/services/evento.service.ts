import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { map} from 'rxjs/operators';
import { Evento } from '../models/Evento';
import { environment } from '@environments/environment';
import { PaginatedResult } from '@app/models/pagination';

@Injectable(
    // {providedIn: 'root'}
)
export class EventoService {
  baseUrl = environment.apiURL + 'api/eventos';
  

  constructor(private http:HttpClient) { }

  public getEventos(page?: number, itemsPerPage?: number): Observable<PaginatedResult<Evento[]>> {
    const paginatedResult : PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();
    
    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
        params = params.append('pageNumber', page.toString());
        params = params.append('pageSize', itemsPerPage.toString());
    }


    return this.http
        .get<Evento[]>(this.baseUrl,{observe: 'response', params})
        .pipe(
            take(1),
            map((response) =>{
                paginatedResult.result = response.body!;
                if(response.headers.has('Pagination')){
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
                }
                return paginatedResult; 
            }));
  }

  public getEventosByTema(tema : string): Observable<Evento[]> {
    return this.http
        .get<Evento[]>(`${this.baseUrl}/${tema}/tema`)
        .pipe(take(1));
  }


  public getEventoById(id : number): Observable<Evento> {
    return this.http
        .get<Evento>(`${this.baseUrl}/${id}`)
        .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http
        .post<Evento>(this.baseUrl, evento)
        .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http
        .put<Evento>(`${this.baseUrl}/${evento.id}`, evento)
        .pipe(take(1));
  }

  public deleteEvento(id : number): Observable<any>{
    return this.http
        .delete(`${this.baseUrl}/${id}`)
        .pipe(take(1));
  }

  postUpload(eventoId: number, file:File): Observable<Evento>{
    const formData = new FormData();
    //const fileToUpload = file[0] as File;
    formData.append('file',file);

    return this.http
    .post<Evento>(`${this.baseUrl}/upload-image/${eventoId}`, formData)
    .pipe(take(1));
  }

}
