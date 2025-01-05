import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, BadRequestException } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  // @Get('currentSession')
  // currentSession() {
  //   return this.sessionService.currentSession();
  // }

  // @Get('currentSessionExist')
  // async currentSessionExist() {
  //   const exists = await this.sessionService.currentSessionExist();
  //   return { result: exists };
  // }

  @Get('NextSession')
  async getSession() {
    return await this.sessionService.getNextSession();
  }

  @Get('ActualSession')
  async getActualSession() {
    return await this.sessionService.getActualSession();
  }
  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles([Role.ADMIN])
  @Post('CreateSession')
  create(@Body() createSessionDto: CreateSessionDto,@Req() req : Request) {
    return this.sessionService.create(createSessionDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles([Role.ADMIN])
  @Put('UpdateSession')
  update(@Body() updateSessionDto: UpdateSessionDto,@Req() req : Request) {
    return this.sessionService.update(updateSessionDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles([Role.ADMIN])
  @Post('DeleteSession')
  delete(@Body() body : any,@Req() req : Request) {
    console.log(body.id);
    if (!body.id) {
      throw new BadRequestException('id is required');
    }
    return this.sessionService.delete(body.id);
  }

  @Post('GetListSession')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles([Role.ADMIN,Role.GESTIONNAIRE])
  getListSession(@Body() body : any) {
    console.log(body);
    return this.sessionService.getListSession(body);
  }

  // @Get()
  // findAll() {
  //   return this.sessionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sessionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
  //   return this.sessionService.update(+id, updateSessionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sessionService.remove(+id);
  // }
}
