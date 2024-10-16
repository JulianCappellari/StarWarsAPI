import { IsString, IsArray, IsOptional } from 'class-validator'; 


export class PeopleDto {
  @IsString()
  name: string;  

  @IsString()
  height: string;  

  @IsString()
  mass: string;  

  @IsString()
  hair_color: string;  

  @IsString()
  skin_color: string; 

  @IsString()
  eye_color: string; 

  @IsString()
  birth_year: string;  

  @IsString()
  gender: string;  

  @IsString()
  @IsOptional()
  homeworld?: string;  

  @IsArray()
  @IsOptional()
  films?: string[];  

  @IsArray()
  @IsOptional()
  species?: string[];  

  @IsArray()
  @IsOptional()
  vehicles?: string[];  

  @IsArray()
  @IsOptional()
  starships?: string[];  

  @IsString()
  created: string;  

  @IsString()
  edited: string;  

  @IsString()
  url: string;  
}
