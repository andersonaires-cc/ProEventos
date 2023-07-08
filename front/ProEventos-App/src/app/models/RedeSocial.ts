import { Evento } from "./Evento";

export interface RedeSocial {
    id : number;
    nome : string;
    uRL : string;
    eventoId? : number;
    evento : Evento;
    palestranteId? : number;
}
