import { AppError } from "../../../shared/errors/app-error";
import { UserRepository } from "../repositories/user.repository";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";

type RegisterInput = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export class AuthService {
  private readonly usersRepository = new UserRepository();
  private readonly hashService = new HashService();
  private readonly jwtService = new JwtService();

  async register(data: RegisterInput) {
    const { name, lastName, email, password } = data;
    
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const passwordHash = await this.hashService.hash(password);

    const user = await this.usersRepository.createUser({
      name,
      lastName,
      email,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      lastName: user.last_name,
      email: user.email,
    };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await this.hashService.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.jwtService.generate({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.last_name,
        email: user.email,
      },
    };
  }
}