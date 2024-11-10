import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { use } from 'passport';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('currentSession')
  currentSession() {
    return this.sessionService.currentSession();
  }

  @Get('currentSessionExist')
  async currentSessionExist() {
    const exists = await this.sessionService.currentSessionExist();
    return { result: exists };
  }

  @Get('NextSession')
  async getSession() {
    return await this.sessionService.getNextSession();
  }

  @Get('ActualSession')
  async getActualSession() {
    return await this.sessionService.getActualSession();
  }
  
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Post('createSession')
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
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
