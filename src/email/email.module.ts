import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { PDFModule } from 'src/pdf/pdf.module';

@Module({
    providers: [EmailService],
    exports: [EmailService], 
})
export class EmailModule {}