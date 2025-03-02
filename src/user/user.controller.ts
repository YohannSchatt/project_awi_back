import { Controller, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { GetUserDto } from './dto/get-user.dto';
import { Payload } from '../common/interface/payload.interface';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('InfoPerso')
    getUser(@Req() req: Request): Promise<GetUserDto> {
        const user = req.user as Payload;
        return this.userService.getUserById(user.idUtilisateur);
    }

    @Put('UpdateInfoPerso')
    updateUser(@Req() req: Request): Promise<void> {
        const user = req.user as Payload;
        return this.userService.updateUser(user.idUtilisateur,req.body);
    }

    @Put('UpdatePassword')
    updatePassword(@Req() req: Request): Promise<void> {
        const user = req.user as Payload;
        const oldPassword : string = req.body.oldMdp;
        const newPassword : string = req.body.newMdp;
        return this.userService.updatePassword(user.idUtilisateur,oldPassword,newPassword);
    }
}
