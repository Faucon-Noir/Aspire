import { CommonDTO } from './CommonDto';

// Get
export interface PhotoDTO extends CommonDTO {
    id: string;
}

// Create
export interface CreatePhotoDTO extends CommonDTO {}

// Update
export interface UpdatePhotoDTO extends Partial<CommonDTO> {}
