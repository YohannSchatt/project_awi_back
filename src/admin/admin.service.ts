import { Injectable } from '@nestjs/common';
import { User } from 'src/authentification/users/users.service';

@Injectable()
export class AdminService {

    public getAdminDataName(user : User): string {
        return user.username ;
    }
}
