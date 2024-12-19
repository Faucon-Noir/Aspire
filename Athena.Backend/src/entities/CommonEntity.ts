import { Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export class CommonEntity extends BaseEntity {
    @Column()
    url: string;

    @Column()
    title: string;

    @Column()
    owner: string;

    @Column()
    description: string;
}
