import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

// The AdminService is a service that provides admin-related functionality.
@Injectable()
export class AdminService {

    // The constructor initializes the AdminService
    constructor(private emailService : EmailService, private userService : UserService) {}

    async createGestionnaire(email : string, prenom : string, nom : string, role : Role) {
        try {
            const password = this.emailService.generateRandomPassword(15);
            await this.userService.createUser({
                prenom : prenom,
                nom : nom,
                email : email,
                role : role,
                password : password
            });
            this.emailService.sendPassword(email,password);
        }
        catch (error) {
            this.deleteGestionnaire(email)
            throw new Error('Une erreur est survenue')
        }    
    }

    async deleteGestionnaire(email : string) {
        try {
            this.userService.deleteUserWithEmail(email);
        }
        catch (error) {
            throw new BadRequestException(error)
        }
    }

    async getGestionnaire() {
        try {
            return await this.userService.getGestionnaire()
        }
        catch (error) {
            console.log(error);
        }
    }

}
