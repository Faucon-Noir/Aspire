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
import { CreatePhotoDTO, PhotoDTO, UpdatePhotoDTO } from "../dto/photoDto";
import { ErrorDTO } from "../dto/errorDto";

@Controller()
export class PhotoController {
  constructor(private PhotoController) {
    this.PhotoController = AppDataSource.getRepository(Photos);
  }

  @Get("/photos/:id")
  /**
   * Retrieves a single photo
   * @param id - The ID of the photo entity to retrieve
   * @returns The detailed photo object
   */
  public async getOnephoto(
    @Param("id") id: string
  ): Promise<PhotoDTO | ErrorDTO> {
    try {
      const photo = await this.PhotoController.findOne({ where: { id } });
      if (!photo) throw new Error("Photo not found");
    } catch (err) {
      return { error: err };
    }
  }

  @Get("/photos")
  /**
   * Retrieves all photos
   * @returns An array of all photo objects
   */
  public async getAllPhotos(): Promise<PhotoDTO[] | ErrorDTO> {
    try {
      const photos = await this.PhotoController.find();
      return photos;
    } catch (err) {
      return { error: err };
    }
  }
  @Post("/photos")
  @HttpCode(201)
  /**
   * Creates a new photo
   * @param photo - The photo object to create
   * @returns The newly created photo object
   */
  public async createPhoto(photo: Photos): Promise<CreatePhotoDTO | ErrorDTO> {
    try {
      const newPhoto = await this.PhotoController.save(photo);
      return newPhoto;
    } catch (err) {
      return { error: err };
    }
  }

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
    try {
      const updatedPhoto = await this.PhotoController.update(id, photo);
      return updatedPhoto;
    } catch (err) {
      return { error: err };
    }
  }

  @Delete("/photos/:id")
  /**
   * Deletes a photo
   * @param id - The ID of the photo entity to delete
   * @returns The deleted photo object
   */
  public async deletePhoto(@Param("id") id: string) {
    try {
      const photo = await this.PhotoController.findOne({ where: { id } });
      if (!photo) throw new Error("Photo not found");
      const deletedPhoto = await this.PhotoController.remove(photo);
      return deletedPhoto;
    } catch (err) {
      return { error: err };
    }
  }
}
