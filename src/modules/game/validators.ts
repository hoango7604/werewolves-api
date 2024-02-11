import { IsOptional, IsString } from 'class-validator'

export class CreatePlayerDto {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  imgUrl?: string
}
