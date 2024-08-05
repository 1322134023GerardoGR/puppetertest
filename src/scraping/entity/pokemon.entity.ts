import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PokemonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  name: string;

  @Column()
  type1: string;

  @Column({ nullable: true })
  type2: string;
}