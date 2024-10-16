import { IsString, IsArray, IsOptional } from 'class-validator'; 


export class PlanetDto {
  @IsString()
  name: string;

  @IsString()
  rotation_period: string;

  @IsString()
  orbital_period: string;

  @IsString()
  diameter: string;

  @IsString()
  climate: string;

  @IsString()
  gravity: string;

  @IsString()
  terrain: string;

  @IsString()
  surface_water: string;

  @IsString()
  population: string;

  @IsArray()
  @IsOptional()
  residents?: string[];

  @IsArray()
  @IsOptional()
  films?: string[];

  @IsString()
  created: string;

  @IsString()
  edited: string;

  @IsString()
  url: string;
}
