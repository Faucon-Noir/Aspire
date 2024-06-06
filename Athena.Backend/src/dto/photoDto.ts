import { CommonDTO } from "./commonDto";

// Get one and all
export interface PhotoDTO extends CommonDTO {
  id: string;
}

// Create
export interface CreatePhotoDTO extends CommonDTO {}

// Update
export interface UpdatePhotoDTO {
  url?: string;
  title?: string;
  description?: string;
}
