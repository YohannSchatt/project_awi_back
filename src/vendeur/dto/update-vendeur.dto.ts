import { PartialType } from '@nestjs/mapped-types';
import { CreateVendeurDto } from './create-vendeur.dto';
import { IsNumber } from 'class-validator';

export class UpdateVendeurDto extends PartialType(CreateVendeurDto) {

    @IsNumber()
    idVendeur: number;
}
