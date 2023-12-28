import { Evento } from "./Evento";

export interface RedeSocial {
    id : number;
    nome : string;
    url : string;
    eventoId? : number;
    evento : Evento;
    palestranteId? : number;
}
