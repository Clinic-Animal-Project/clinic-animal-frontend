
export interface PersonalResponse {
    id: number;
    nombrePersonal: string;
    apellidoPersonal: string;
    edad: number;
    dni: string;
    email: string;
    telefono: string;
    idRol: number;
    nombreRol: string;
    idArea: number;
    nomArea: string;
    fechaRegistro: string; // Usamos string para fechas en respuestas JSON
    estadoPersonal: EstadoPersonal;
}

export enum EstadoPersonal {
    DISPONIBLE = 'DISPONIBLE',
    OCUPADO = 'OCUPADO',
    DESCANSO = 'DESCANSO',
    NO_DISPONIBLE = 'NO_DISPONIBLE'
}
