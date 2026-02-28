export interface Client{
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion?: string;
}


export interface ClienteRequestDto{
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion?: string;
  email: string;
}