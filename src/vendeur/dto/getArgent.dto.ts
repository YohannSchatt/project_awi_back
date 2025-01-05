import {IsNotEmpty, IsNumber} from 'class-validator';

export class GetArgent {
    @IsNumber()
    @IsNotEmpty()
    idVendeur: number;
}