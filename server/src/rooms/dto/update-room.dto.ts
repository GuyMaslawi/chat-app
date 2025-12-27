import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}

