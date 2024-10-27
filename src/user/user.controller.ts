import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.getUserById(Number(id));
  }

  
}
