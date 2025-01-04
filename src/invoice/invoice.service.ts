import { Injectable } from '@nestjs/common';
import { PDFService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';
import * as fs from 'fs';
import { InvoiceDto } from 'src/pdf/dto/invoice.dto';

@Injectable()
export class InvoiceService {

    public constructor(private PDF : PDFService, private emailService : EmailService) {}

    async generateInvoicePDF(invoiceData: InvoiceDto): Promise<Buffer> {
        const pdfBuffer = await this.PDF.generateInvoicePDF(invoiceData);
        return pdfBuffer;
    }

    async sendInvoiceEmail(invoiceData: any, email: string) : Promise<Buffer> {
        const pdf : Buffer = await this.generateInvoicePDF(invoiceData);
        await this.emailService.sendInvoice(email, pdf);
        return pdf
    }

}