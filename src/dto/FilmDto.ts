import { IsString, IsArray, IsOptional } from 'class-validator'; 


export class FilmsDto {
  @IsString()
  title: string;  

  @IsString()
  director: string;  

  @IsString()
  producer: string;  

  @IsString()
  release_date: string;  

  @IsArray()
  @IsOptional()
  characters?: string[];  
  @IsArray()
  @IsOptional()
  planets?: string[];  

  @IsArray()
  @IsOptional()
  starships?: string[];  

  @IsArray()
  @IsOptional()
  vehicles?: string[];  

  @IsArray()
  @IsOptional()
  species?: string[];  
}
