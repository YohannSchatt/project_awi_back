import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {

    @IsNumber()
    @IsNotEmpty()
    id: number;
}
