export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface UserDTO extends CreateUserDTO {
  id: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}
