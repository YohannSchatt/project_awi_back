import { Body, Controller, Get, Res, UseGuards, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response } from 'express';
import { InvoiceDto } from '../pdf/dto/invoice.dto';
import { Etat } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';


@Roles([Role.ADMIN,Role.GESTIONNAIRE])
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Get('generate')
    async generateInvoicePDFTest(@Res() res: Response) {
        const invoiceData : InvoiceDto = {
            email: 'yohann.schatt@gmail.com',
            date: new Date(),
            items: [
                { idJeuUnitaire: 1 ,nom: 'Item 1', editeur: "hasbro", prix: 10.0, etat: Etat.NEUF },
                { idJeuUnitaire: 2 ,nom: 'Item 2', editeur: "jacquie", prix: 20.0, etat: Etat.BONNE_ETAT },
            ]
        };

        await this.invoiceService.sendInvoiceEmail(invoiceData, invoiceData.email);
        return res.status(200).send('Invoice generated');
    }

    @Post('')
    async getInvoices(@Res() res: Response, @Body() body: InvoiceDto) {
        const invoices = await this.invoiceService.sendInvoiceEmail(body, body.email);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=invoice_${body.email}_${new Date(body.date).toISOString()}.pdf`,
            'Content-Length': invoices.length,
        });

        return res.send(invoices);
    }
    
}