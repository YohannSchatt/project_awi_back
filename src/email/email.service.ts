import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    constructor(private configService: ConfigService) {}

    private async sendEmail(email: string, subject: string, text: string, pdf?: Buffer) {
        console.log(this.configService.get<string>('email_mdp'));
        const attachments = pdf ? [{filename: 'invoice.pdf', content: pdf}] : [];

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'jeutaroevent@gmail.com',
            pass: this.configService.get<string>('email_mdp'), 
          },
        });

        const mailOptions = {
            from: 'jeutaroevent@gmail.com', // Adresse de l'expéditeur
            to: email, // Adresse du destinataire
            subject: subject, // Sujet de l'email
            text: text, // Contenu de l'email
            attachments: attachments,
          };
        
          try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
          } catch (error) {
            throw new BadRequestException(error.message);
          }
    }

    async sendPassword(email: string, password: string) {
        const subject = 'Your password for Jeutaro account';
        const text = `Your password is: ${password}\n Please change it as soon as possible \n Le lien pour vous connecter est : ${this.configService.get('database.url_front')}/gestion`;
        await this.sendEmail(email, subject, text);
    }

    async sendInvoice(email: string, pdf: Buffer) {
        const subject = 'Invoice';
        const text = 'Please find attached the invoice';
        await this.sendEmail(email, subject, text, pdf);
    }

    generateRandomPassword(length: number): string {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        return password;
      }
}
