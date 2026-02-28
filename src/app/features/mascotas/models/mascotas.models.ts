export interface Mascota{
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  sexo: string;
  idCliente?: number;
    nombreCliente?: string;
}

export interface MascotaRequestDto{
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  sexo: string;
  idCliente: number;
}