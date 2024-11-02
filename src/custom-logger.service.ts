import { Logger, Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private logFilePath: string;
  private shouldLog: boolean;

  constructor() {
    super();
    this.logFilePath = path.join(__dirname, '..', 'mapped-routes.txt');
    this.shouldLog = false;
    this.clearLogFile();
  }

    private clearLogFile() {
        fs.writeFileSync(this.logFilePath, '');
    }

  log(message: string) {
    super.log(message);
    if (message.startsWith('Mapped')) {
      this.shouldLog = true;
    }
    if (this.shouldLog) {
      this.writeToFile(message);
    }
    if (message.includes('Controller')) {
      const resource = this.extractResourceFromController(message);
      this.logController(resource);
    }
  }

  private extractResourceFromController(message: string): string {
    const match = message.match(/Controller \{\/(\w+)\}/);
    return match ? match[1] : '';
  }

  private writeToFile(message: string) {
    fs.appendFileSync(this.logFilePath, `${message}\n`);
  }

  private logController(resource: string) {
    const dtoPath = path.join(__dirname, '..', 'src', resource, 'dto');
    if (fs.existsSync(dtoPath)) {
      const dtoFiles = fs.readdirSync(dtoPath);
      dtoFiles.forEach((file) => {
        const dtoContent = fs.readFileSync(path.join(dtoPath, file), 'utf-8');
        this.writeToFile(`DTO {${file}}: ${dtoContent}`);
      });
    }
  }
}