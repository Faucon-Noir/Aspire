import { CommonDTO } from './CommonDto';

// Get one and all
export interface VideoDTO extends CommonDTO {
    id: string;
}

// Create
export interface CreateVideoDTO extends CommonDTO {}

// Update
export interface UpdateVideoDTO extends Partial<CommonDTO> {}
