import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { Photos } from "../entities/Photos";
import { CreatePhotoDTO, PhotoDTO, UpdatePhotoDTO } from "../dto/PhotoDto";
import { ErrorDTO } from "../dto/ErrorDto";
import { trace } from "@opentelemetry/api";

@Controller()
export class PhotoController {
	constructor(private PhotoController) {
		this.PhotoController = AppDataSource.getRepository(Photos);
	}
	tracer = trace.getTracer("portfolio-api");

	/**
	 * @swagger
	 * /photos/{id}:
	 *  get:
	 *    tags:
	 *      - Photos
	 *    summary: Retrieves a single photo
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: string
	 *        description: The ID of the photo entity to retrieve
	 *    responses:
	 *      '200':
	 *        description: The detailed photo object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/PhotoDTO'
	 *      '404':
	 *        description: The photo was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Get("/photos/:id")
	/**
	 * Retrieves a single photo
	 * @param id - The ID of the photo entity to retrieve
	 * @returns The detailed photo object
	 */
	public async getOnephoto(
		@Param("id") id: string
	): Promise<PhotoDTO | ErrorDTO> {
		const span = this.tracer.startSpan("getOnePhoto");
		try {
			const photo = await this.PhotoController.findOne({ where: { id } });
			span.setAttribute("photo", photo);
			span.end();
			return photo;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /photos:
	 *  get:
	 *    tags:
	 *      - Photos
	 *    summary: Retrieves all photos
	 *    responses:
	 *      '200':
	 *        description: An array of all photo objects
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: array
	 *              items:
	 *                $ref: '#/components/schemas/PhotoDTO'
	 *      '404':
	 *        description: The photo was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Get("/photos")
	/**
	 * Retrieves all photos
	 * @returns An array of all photo objects
	 */
	public async getAllPhotos(): Promise<PhotoDTO[] | ErrorDTO> {
		const span = this.tracer.startSpan("getAllPhotos");
		try {
			const photos = await this.PhotoController.find();
			span.setAttribute("num_photos", photos.length);
			span.end();
			return photos;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /photos:
	 *  post:
	 *    tags:
	 *      - Photos
	 *    summary: Creates a new photo
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/Photos'
	 *    responses:
	 *      '201':
	 *        description: The newly created photo object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/CreatePhotoDTO'
	 *      '400':
	 *        description: Invalid photo object
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
	 *      '404':
	 *        description: The photo was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Post("/photos")
	@HttpCode(201)
	/**
	 * Creates a new photo
	 * @param photo - The photo object to create
	 * @returns The newly created photo object
	 */
	public async createPhoto(
		photo: Photos
	): Promise<CreatePhotoDTO | ErrorDTO> {
		const span = this.tracer.startSpan("createPhoto");
		try {
			const newPhoto = await this.PhotoController.save(photo);
			span.setAttribute("create_photo", newPhoto);
			span.end();
			return newPhoto;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /photos/{id}:
	 *  patch:
	 *    tags:
	 *      - Photos
	 *    summary: Updates an existing photo
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: string
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/Photos'
	 *    responses:
	 *      '200':
	 *        description: The updated photo object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/UpdatePhotoDTO'
	 *      '400':
	 *        description: Invalid photo object
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
	 *      '404':
	 *        description: The photo was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Patch("/photos/:id")
	/**
	 * Updates a photo
	 * @param id - The ID of the photo entity to update
	 * @param photo - The updated photo object
	 * @returns The updated photo object
	 */
	public async updatePhoto(
		@Param("id") id: string,
		photo: Photos
	): Promise<UpdatePhotoDTO | ErrorDTO> {
		const span = this.tracer.startSpan("updatePhoto");
		try {
			const updatedPhoto = await this.PhotoController.update(id, photo);
			span.setAttribute("updated_photo", updatedPhoto);
			span.end();
			return updatedPhoto;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /photos/{id}:
	 *  delete:
	 *    tags:
	 *      - Photos
	 *    summary: Deletes a photo
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: string
	 *        description: The ID of the photo entity to delete
	 *    responses:
	 *      '200':
	 *        description: The deleted photo object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/PhotoDTO'
	 *      '400':
	 *        description: Invalid photo object
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
	 *      '404':
	 *        description: The photo was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Delete("/photos/:id")
	/**
	 * Deletes a photo
	 * @param id - The ID of the photo entity to delete
	 * @returns The deleted photo object
	 */
	public async deletePhoto(@Param("id") id: string) {
		const span = this.tracer.startSpan("deletePhoto");
		try {
			const photo = await this.PhotoController.findOne({ where: { id } });
			if (!photo) throw new Error("Photo not found");
			const deletedPhoto = await this.PhotoController.remove(photo);
			span.setAttribute("deleted_photo", deletedPhoto);
			span.end();
			return deletedPhoto;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}
}
