import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";
import { RegisterInput, LoginInput } from "../lib/validations/auth.schema";
import { ConflictError, UnauthorizedError, NotFoundError } from "../lib/errors";
import { signToken, TokenPayload } from "../lib/auth/jwt";

export class AuthService {
  static async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || "GUEST";
    // Guests are approved by default; Staff/Admin registrations require explicit Admin approval
    const isApproved = role === "GUEST" ? true : false;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        phone: data.phone,
        role: role,
        isApproved: isApproved,
      } as any,
    });

    const userApproved = (user as any).isApproved ?? isApproved;

    // If account requires admin approval, do not issue an active session token yet
    if (!userApproved) {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isApproved: false,
        },
        token: "",
        requiresApproval: true,
      };
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as "GUEST" | "ADMIN",
      name: user.name,
    };

    const token = signToken(tokenPayload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isApproved: true,
      },
      token,
      requiresApproval: false,
    };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const userApproved = (user as any).isApproved;

    // Check staff approval status
    if (userApproved === false) {
      throw new UnauthorizedError("Your staff account is pending Admin approval. Please contact an administrator.");
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as "GUEST" | "ADMIN",
      name: user.name,
    };

    const token = signToken(tokenPayload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isApproved: userApproved ?? true,
      },
      token,
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
