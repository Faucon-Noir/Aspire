import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedError,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { ErrorDTO } from "../dto/errorDto";
import { CreateUserDTO, UserDTO } from "../dto/userDto";
import { Users } from "../entities/User";
import jwt from "jsonwebtoken";

@Controller()
export class RegisterController {
  constructor(private UserController) {
    this.UserController = AppDataSource.getRepository(Users);
  }

  @Post("/unlock-register")
  @HttpCode(200)
  /**
   * Unlocks the register form
   * @param text - The text to unlock the register form
   * @returns A message indicating the register form is unlocked
   */
  unlockRegister(@Body() body: { text: string }) {
    const { text } = body;

    if (text !== "expected text") {
      throw new UnauthorizedError("Invalid acces token");
    }
    const token = jwt.sign({ text }, "your-secret-key", {
      expiresIn: "10m",
    });
    return { message: "Access granted" };
  }

  @Post("/register")
  @HttpCode(201)
  /**
   * Creates a new user
   * @param user - The user object to create
   * @returns The newly created user object
   */
  public async createUser(
    @Body() user: UserDTO
  ): Promise<{ token: string } | ErrorDTO> {
    try {
      const newUser = await this.UserController.save(user);
      const token = jwt.sign({ id: newUser.id }, "your-secret-key", {
        expiresIn: "10m",
      });
      return { token };
    } catch (err) {
      return { error: err };
    }
  }
}
