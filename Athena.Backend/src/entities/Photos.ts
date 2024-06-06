import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photos {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
