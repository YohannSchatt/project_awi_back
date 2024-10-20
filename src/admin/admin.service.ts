import { Injectable } from '@nestjs/common';
import { User } from 'src/authentification/users/users.service';


// The AdminService is a service that provides admin-related functionality.
@Injectable()
export class AdminService {

    public getAdminDataName(user : User): string {
        return user.username ;
    }
}
