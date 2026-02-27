import { Client } from "../../clientes/model/client-model";
import { AreasResponse } from "../../crud/areas/model/areas.model";
import { PersonalResponse } from "../../crud/personal/model/personal.model";
import { ServicioResponse } from "../../crud/servicios/model/servicio.model";
import { Mascota } from "../../mascotas/models/mascotas.models";

export interface CitasRequest {
    fechaHora: string; // Usamos string para fechas en solicitudes JSON
    idArea: number;
    idMascota: number;
    idCliente: number;
    estado: EstadoCita; // Solo PROGRAMADA o EN_COLA permitidos al crear
    idVeterinario?: number | null; // Requerido solo si estado == EN_COLA
    servicios: CitaServicioRequestDto[];
}

export interface CitaServicioRequestDto {
    idServicio: number;
    cantidad: number;
    precioBase: number;
}

export interface CitasResponse{
    id: number;
    fechaHora: string; // Usamos string para fechas en respuestas JSON
    cliente: Client;
    mascota: Mascota;
    area: AreasResponse;
    veterinario: PersonalResponse;
    estado: EstadoCita;
    servicios: CitaServicioResponseDto[];
}

export interface CitaServicioResponseDto {
    servicio: ServicioResponse;
    cantidad: string;
    precioBase: number;
    subTotal: number;
}

export enum EstadoCita {
    PROGRAMADA = 'PROGRAMADA',
    EN_COLA = 'EN_COLA',
    EN_PROGRESO = 'EN_PROGRESO',
    FINALIZADA = 'FINALIZADA',
    CANCELADA = 'CANCELADA',
    PAGADA = 'PAGADA'
}