import {
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedError,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { ErrorDTO } from "../dto/ErrorDto";
import { Users } from "../entities/User";
import jwt from "jsonwebtoken";
import { LoginDTO, RegisterDTO } from "../dto/AuthDto";
import { trace } from "@opentelemetry/api";

@Controller()
export class RegisterController {
	constructor(private UserController) {
		this.UserController = AppDataSource.getRepository(Users);
	}
	tracer = trace.getTracer("portfolio-api");

	/**
	 * @swagger
	 * /register:
	 *  post:
	 *    tags:
	 *      - Auth
	 *    summary: Creates a new user
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/RegisterDTO'
	 *    responses:
	 *      '201':
	 *        description: The newly created user object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                token:
	 *                  type: string
	 *      '400':
	 *        description: Invalid user object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 *      '401':
	 *        description: Unauthorized
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Post("/register")
	@HttpCode(201)
	/**
	 * Creates a new user
	 * @param user - The user object to create
	 * @returns The newly created user object
	 */
	public async createUser(
		@Body() user: RegisterDTO
	): Promise<{ token: string } | ErrorDTO> {
		const span = this.tracer.startSpan("createUser");
		try {
			const newUser = await this.UserController.save(user);
			const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});
			span.setAttribute("new_user", newUser.id);
			span.end();
			return { token };
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /login:
	 *  post:
	 *    tags:
	 *      - Auth
	 *    summary: Logs in a user
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/LoginDTO'
	 *    responses:
	 *      '200':
	 *        description: Successful operation, user logged in
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                token:
	 *                  type: string
	 *      '400':
	 *        description: Invalid login object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 *      '401':
	 *        description: Unauthorized - Invalid username or password
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Post("/login")
	/**
	 * Logs in a user
	 * @param body - The user object to log in
	 * @returns A token expiring in 24 hours
	 */
	async login(@Body() body: LoginDTO): Promise<{ token: string } | ErrorDTO> {
		const span = this.tracer.startSpan("login");
		try {
			const { username, password } = body;
			const user = await this.UserController.findOne({
				where: { username },
			});
			if (!user || user.password !== password) {
				throw new UnauthorizedError("Invalid username or password");
			}
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: "12h",
			});
			return { token };
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}
}
