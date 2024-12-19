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
import { Videos } from "../entities/Videos";
import { ErrorDTO } from "../dto/ErrorDto";
import { VideoDTO, CreateVideoDTO, UpdateVideoDTO } from "../dto/VideoDto";
import { trace } from "@opentelemetry/api";

@Controller()
export class VideoController {
	constructor(private VideoController) {
		this.VideoController = AppDataSource.getRepository(Videos);
	}

	tracer = trace.getTracer("portfolio-api");

	/**
	 * @swagger
	 * /videos/{id}:
	 *  get:
	 *    tags:
	 *      - Videos
	 *    summary: Retrieves a single video
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: string
	 *        description: The ID of the video entity to retrieve
	 *    responses:
	 *      '200':
	 *        description: The detailed video object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/VideoDTO'
	 *      '404':
	 *        description: The video was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Get("/videos/:id")
	/**
	 * Retrieves a single video
	 * @param id - The ID of the video entity to retrieve
	 * @returns The detailed video object
	 */
	public async getOneVideo(
		@Param("id") id: string
	): Promise<VideoDTO | ErrorDTO> {
		const span = this.tracer.startSpan("getOneVideo");
		try {
			const video = await this.VideoController.findOne({ where: { id } });
			span.setAttribute("one_video", video);
			return video;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /videos:
	 *  get:
	 *    tags:
	 *      - Videos
	 *    summary: Retrieves all videos
	 *    responses:
	 *      '200':
	 *        description: An array of all video objects
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: array
	 *              items:
	 *                $ref: '#/components/schemas/VideoDTO'
	 *      '404':
	 *        description: No videos were found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Get("/videos")
	/**
	 * Retrieves all videos
	 * @returns An array of all video objects
	 */
	public async getAllVideos(): Promise<VideoDTO[] | ErrorDTO> {
		const span = this.tracer.startSpan("getAllVideos");
		try {
			const videos = await this.VideoController.find();
			span.setAttribute("num_videos", videos.length);
			span.end();
			return videos;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /videos:
	 *  post:
	 *    tags:
	 *      - Videos
	 *    summary: Creates a new video
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/Videos'
	 *    responses:
	 *      '201':
	 *        description: The newly created video object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/CreateVideoDTO'
	 *      '400':
	 *        description: Invalid video object
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
	 *        description: The video was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Post("/videos")
	@HttpCode(201)
	/**
	 * Creates a new video
	 * @param video - The video object to create
	 * @returns The newly created video object
	 */
	public async createVideo(
		video: Videos
	): Promise<CreateVideoDTO | ErrorDTO> {
		const span = this.tracer.startSpan("createVideo");
		try {
			const newVideo = await this.VideoController.save(video);
			span.setAttribute("new_video", newVideo);
			span.end();
			return newVideo;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /videos/{id}:
	 *  patch:
	 *    tags:
	 *      - Videos
	 *    summary: Updates an existing video
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: string
	 *        description: The ID of the video entity to update
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/Videos'
	 *    responses:
	 *      '200':
	 *        description: The updated video object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/UpdateVideoDTO'
	 *      '400':
	 *        description: Invalid video object
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
	 *        description: The video was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Patch("/videos/:id")
	/**
	 * Updates an existing video
	 * @param id - The ID of the video entity to update
	 * @param video - The updated video object
	 * @returns The updated video object
	 */
	public async updateVideo(
		@Param("id") id: string,
		video: Videos
	): Promise<UpdateVideoDTO | ErrorDTO> {
		const span = this.tracer.startSpan("updateVideo");
		try {
			const updatedVideo = await this.VideoController.update(id, video);
			span.setAttribute("updated_video", updatedVideo);
			return updatedVideo;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}

	/**
	 * @swagger
	 * /videos/{id}:
	 *  delete:
	 *    tags:
	 *      - Videos
	 *    summary: Deletes an existing video
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: string
	 *        description: The ID of the video entity to delete
	 *    responses:
	 *      '200':
	 *        description: The deleted video object
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/VideoDTO'
	 *      '400':
	 *        description: Invalid video object
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
	 *        description: The video was not found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ErrorDTO'
	 */
	@Delete("/videos/:id")
	/**
	 * Deletes an existing video
	 * @param id - The ID of the video entity to delete
	 * @returns The deleted video object
	 */
	public async deleteVideo(@Param("id") id: string) {
		const span = this.tracer.startSpan("deleteVideo");
		try {
			const deletedVideo = await this.VideoController.delete(id);
			span.setAttribute("deleted_video", deletedVideo);
			span.end();
			return deletedVideo;
		} catch (err) {
			span.setAttribute("error", err.message);
			span.end();
			return { error: err };
		}
	}
}
