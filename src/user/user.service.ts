import { BadRequestException, Injectable, NotFoundException, Param, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserDto } from './dto/get-user.dto';
import { GetPayloadDto } from './dto/get-payload.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number): Promise<GetUserDto> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { idUtilisateur : id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      idUtilisateur: user.idUtilisateur,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, prenom, nom, email, role } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.utilisateur.create({
      data: {
        prenom: prenom,
        nom: nom,
        email: email,
        role: role,
        password: hashedPassword,
      },
    });
    if (!user) {
        throw new BadRequestException('User not created');
    }
  }

  async validateUser(email : string,password : string): Promise<GetPayloadDto> {
    const user = await this.prisma.utilisateur.findUnique({
        where : { 
            email : email,
        }
    })
    if (!user){
        throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
    }

    return {
        idUtilisateur : user.idUtilisateur,
        role: user.role
    }
  }
}