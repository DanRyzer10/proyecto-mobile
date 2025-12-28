export interface MensajeEntrada {
    fechaTransaccion:string;
    data: any;
    canal: string
}

export interface MensajeSalida {
    codigoRespuesta: string;
    mensajeSistema: string;
    data?: any;
    fechaTransaccion:string;
}