import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PDFModule } from '../pdf/pdf.module'; 
import { EmailModule } from '../email/email.module'; 

@Module({
    imports: [PDFModule, EmailModule], // Ajouter les modules importés ici
    providers: [InvoiceService],
    controllers: [InvoiceController],
})
export class InvoiceModule {}