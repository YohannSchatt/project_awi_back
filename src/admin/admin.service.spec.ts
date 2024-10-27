import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AdminController],
      providers: [AdminService, JwtAuthGuard, RolesGuard],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
