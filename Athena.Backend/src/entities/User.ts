import { Column, Entity } from 'typeorm';
import { CommonEntity } from './CommonEntity';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Users extends BaseEntity {
    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
