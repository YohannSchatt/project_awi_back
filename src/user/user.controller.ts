import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-user.dto';

@Controller('user')
export class UserController {}
