import { CommonDTO } from "./commonDto";

// Get one and all
export interface VideoDTO extends CommonDTO {
  id: string;
}

// Create
export interface CreateVideoDTO extends CommonDTO {}

// Update
export interface UpdateVideoDTO {
  url?: string;
  title?: string;
  description?: string;
}
