import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedError,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { Users } from "../entities/User";
import { LoginDTO, UpdateUserDTO, UserDTO } from "../dto/userDto";
import { ErrorDTO } from "../dto/errorDto";
import jwt from "jsonwebtoken";

@Controller()
export class UserController {
  constructor(private UserController) {
    this.UserController = AppDataSource.getRepository(Users);
  }
  @Get("/photos/:id")
  /**
   * Retrieves a single user
   * @param id - The ID of the user entity to retrieve
   * @returns The detailed user object
   */
  public async getOneUser(
    @Param("id") id: string
  ): Promise<UserDTO | ErrorDTO> {
    try {
      const user = await this.UserController.findOne({ where: { id } });
      if (!user) throw new Error("User not found");
    } catch (err) {
      return { error: err };
    }
  }

  @Patch("/user/:id")
  /**
   * @param id - The ID of the user entity to update
   * @param user - The updated user object
   * @returns The updated user object
   */
  public async updateUser(
    @Param("id") id: string,
    user: UserDTO
  ): Promise<UpdateUserDTO | ErrorDTO> {
    try {
      const updatedUser = await this.UserController.update(id, user);
      return updatedUser;
    } catch (err) {
      return { error: err };
    }
  }

  @Post("/login")
  /**
   * Logs in a user
   * @param body - The user object to log in
   * @returns A token expiring in 24 hours
   */
  async login(@Body() body: LoginDTO) {
    const { username, password } = body;

    const user = await this.UserController.findOne({ where: { username } });
    if (!user || user.password !== password) {
      throw new UnauthorizedError("Invalid username or password");
    }
    const token = jwt.sign({ id: user.id }, "your-secret-key", {
      expiresIn: "24h",
    });
    return { token };
  }
}
