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

  /**
   * 
   * @param origem  Precisa passar a palavra 'palestrante' ou a palçavra 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou o EventoId dependendo da sua origem
   * @param redesSociais Precisa adicionar redes sociais organizadas em RedeSocial[]
   * @returns Obsevable<RedeSocial[]>
   */
  public saveRedesSociais(
    origem: string, 
    id: number,
    redesSocial: RedeSocial[]
    ): Observable<RedeSocial[]>{
    let URL = 
        id === 0 
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`

    return this.http.put<RedeSocial[]>(URL,redesSocial).pipe(take(1));
  }

   /**
   * 
   * @param origem  Precisa passar a palavra 'palestrante' ou a palçavra 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou o EventoId dependendo da sua origem
   * @param redeSocialId Precisa usar o Id da Rede Social
   * @returns Obsevable<any> - pois é o retorno da rota
   */
   public deleteRedeSocial(
    origem: string, 
    id: number,
    redeSocialId: number
    ): Observable<any>{
    let URL = 
        id === 0 
        ? `${this.baseURL}/${origem}/${redeSocialId}`
        : `${this.baseURL}/${origem}/${id}/${redeSocialId}`

    return this.http.delete(URL).pipe(take(1));
  }

}
