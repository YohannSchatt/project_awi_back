import { Injectable } from '@nestjs/common';
import { User } from '../authentification/users/users.service';

// The GestionnaireService is a service that provides gestionnaire-related functionality.
@Injectable()
export class GestionnaireService {

    public getGestionnaireDataName(user : User): string {
        return user.username ;
    }
}
