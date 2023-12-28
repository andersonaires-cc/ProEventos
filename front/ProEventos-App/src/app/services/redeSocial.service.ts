import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { environment } from '@environments/environment';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialServiceService {
  baseURL = environment.apiURL + 'api/redesSociais';

  constructor(private http: HttpClient) { }

  /**
   * 
   * @param origem  Precisa passar a palavra 'palestrante' ou a palçavra 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou o EventoId dependendo da sua origem
   * @returns Obsevable<RedeSocial[]>
   */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]>{
    let URL = 
        id === 0 
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`

    return this.http.get<RedeSocial[]>(URL).pipe(take(1));
  }

}
