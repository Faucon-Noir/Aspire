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
import { ErrorDTO } from "../dto/errorDto";
import { VideoDTO, CreateVideoDTO, UpdateVideoDTO } from "../dto/videoDto";

@Controller()
export class VideoController {
  constructor(private VideoController) {
    this.VideoController = AppDataSource.getRepository(Videos);
  }

  @Get("/videos/:id")
  /**
   * Retrieves a single video
   * @param id - The ID of the video entity to retrieve
   * @returns The detailed video object
   */
  public async getOneVideo(
    @Param("id") id: string
  ): Promise<VideoDTO | ErrorDTO> {
    try {
      const video = await this.VideoController.findOne({ where: { id } });
      return video;
    } catch (err) {
      return { error: err };
    }
  }

  @Get("/videos")
  /**
   * Retrieves all videos
   * @returns An array of all video objects
   */
  public async getAllVideos(): Promise<VideoDTO[] | ErrorDTO> {
    try {
      const videos = await this.VideoController.find();
      return videos;
    } catch (err) {
      return { error: err };
    }
  }

  @Post("/videos")
  @HttpCode(201)
  /**
   * Creates a new video
   * @param video - The video object to create
   * @returns The newly created video object
   */
  public async createVideo(video: Videos): Promise<CreateVideoDTO | ErrorDTO> {
    try {
      const newVideo = await this.VideoController.save(video);
      return newVideo;
    } catch (err) {
      return { error: err };
    }
  }

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
    try {
      const updatedVideo = await this.VideoController.update(id, video);
      return updatedVideo;
    } catch (err) {
      return { error: err };
    }
  }

  @Delete("/videos/:id")
  /**
   * Deletes an existing video
   * @param id - The ID of the video entity to delete
   * @returns The deleted video object
   */
  public async deleteVideo(@Param("id") id: string) {
    try {
      const deletedVideo = await this.VideoController.delete(id);
      return deletedVideo;
    } catch (err) {
      return { error: err };
    }
  }
}
