import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import { InvoiceDto } from './dto/invoice.dto';


@Injectable()
export class PDFService {

    constructor(private configService: ConfigService) {}

    async generateInvoicePDF(invoiceData: InvoiceDto): Promise<Buffer> {
        console.log(invoiceData);
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        const fontSize = 12;

        // Add invoice title
        page.drawText('Invoice', {
            x: 50,
            y: height - 50,
            size: 20,
            color: rgb(0, 0, 0),
        });

        // Add customer details
        page.drawText(`Customer: ${invoiceData.email}`, {
            x: 50,
            y: height - 100,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Date: ${invoiceData.date}`, {
            x: 50,
            y: height - 120,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        // Add table headers
        page.drawText('Nom', {
            x: 50,
            y: height - 160,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText('Editeur', {
            x: 200,
            y: height - 160,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText('Etat', {
            x: 300,
            y: height - 160,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText('Prix', {
            x: 400,
            y: height - 160,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        // Add table rows
        let yPosition = height - 180;
        invoiceData.items.forEach(item => {
            page.drawText(item.nom, {
                x: 50,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });

            page.drawText(item.editeur, {
                x: 200,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });

            page.drawText(item.etat, {
                x: 300,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });

            page.drawText(item.prix.toFixed(2), {
                x: 400,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });

            yPosition -= 20;
        });

        // calcul total price
        var Total = 0;
        for(let i = 0; i < invoiceData.items.length; i++) {
            Total += invoiceData.items[i].prix;
        }

        // Add total price
        page.drawText(`Total: ${Total}`, {
            x: 50,
            y: yPosition - 20,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        const pathFileName : string = 'src/pdf/invoice/' + invoiceData.email + "_" + this.getDateForInvoice(new Date(invoiceData.date)) + '.pdf';
        return Buffer.from(pdfBytes);
    }

    async saveInvoicePDF(filePath: string, pdfBuffer : Uint8Array): Promise<void> {
        fs.writeFileSync(filePath, pdfBuffer);
    }

    async pdfFinder(filePath: string): Promise<Buffer> {
        return fs.readFileSync(filePath);
    }

    getDateForInvoice(date: Date): string {
        console.log(date);
        return date.getFullYear().toString() + '-' +
               (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
               date.getDate().toString().padStart(2, '0') + ' ' +
               date.getHours().toString().padStart(2, '0') + '-' +
               date.getMinutes().toString().padStart(2, '0') + '-' +
               date.getSeconds().toString().padStart(2, '0');
    }
}
