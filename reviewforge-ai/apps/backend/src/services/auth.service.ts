import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { generateAccessToken } from "../utils/jwt";

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exist");
    }
    const passwordHash = await hashPassword(password);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
    });

    const accessToken = generateAccessToken(user.id, user.role);
    return { accessToken };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid Credentials");
    }
    const accessToken = generateAccessToken(user.id, user.role);
    return { accessToken };
  }
}
