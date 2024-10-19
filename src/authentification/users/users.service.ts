import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

// This should be a real class/interface representing a user entity
export interface User {
    userId: number;
    username: string;
    password: string;
    role : string;
  }

@Injectable()
export class UsersService {
  private readonly users : User[];

  constructor() {
    const filePath = './src/authentification/users/connexion.json';
    const fileContents = readFileSync(filePath, 'utf8');
    this.users = JSON.parse(fileContents);
  }


  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}