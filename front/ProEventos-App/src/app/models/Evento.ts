export interface Evento{
    Id: number;
    Local: string;
    DataEvento?: Date;
    Tema: string;
    QtdPessoas: number;
    ImagemURL: string;
    Telefone: string;
    Email: string;
    Lotes: Lote[];
    RedesSociais: RedeSocial[];
    PalestrantesEventos: Palestrante[];
}