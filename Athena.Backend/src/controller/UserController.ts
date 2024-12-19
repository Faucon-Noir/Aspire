import { Controller, Get, Param, Patch } from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { Users } from "../entities/User";
import { UpdateUserDTO, UserDTO } from "../dto/UserDto";
import { ErrorDTO } from "../dto/ErrorDto";
import { trace } from "@opentelemetry/api";

@Controller()
export class UserController {
	constructor(private UserController) {
		this.UserController = AppDataSource.getRepository(Users);
	}
	tracer = trace.getTracer("portfolio-api");

	@Get("/user/:id")
	/**
	 * Retrieves a single user
	 * @param id - The ID of the user entity to retrieve
	 * @returns The detailed user object
	 */
	public async getOneUser(
		@Param("id") id: string
	): Promise<UserDTO | ErrorDTO> {
		const span = this.tracer.startSpan("getOneUser");
		try {
			const user = await this.UserController.findOne({ where: { id } });
			if (!user) throw new Error("User not found");
			span.setAttribute("user", JSON.stringify(user));
			span.end();
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
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
		const span = this.tracer.startSpan("updateUser");
		try {
			const updatedUser = await this.UserController.update(id, user);
			if (!updatedUser) throw new Error("User not found");
			span.setAttribute("user", JSON.stringify(updatedUser));
			span.end();
			return updatedUser;
		} catch (err) {
			return { error: err };
		}
	}
}
