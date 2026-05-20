import { PrismaService } from '../../../shared/services/prisma/prisma.service';
import { User } from '../../../shared/services/prisma/prisma-client/client';

type CreateUserInput = {
  name: string;
  lastName: string;
  email: string;
  passwordHash: string;
};

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return PrismaService.client.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return PrismaService.client.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const { name, lastName, email, passwordHash } = data;
    
    return PrismaService.client.user.create({
      data: {
        name,
        last_name: lastName,
        email,
        password_hash: passwordHash,
      },
    });
  }
}
