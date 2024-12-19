import { RegisterDTO } from './AuthDto';

export interface UserDTO extends RegisterDTO {
    id: string;
}

export interface UpdateUserDTO extends Partial<RegisterDTO> {}
