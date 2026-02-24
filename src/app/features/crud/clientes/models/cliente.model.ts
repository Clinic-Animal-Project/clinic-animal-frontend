export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClienteDto {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion?: string;
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {
  id: number;
}
