import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('simple-array')
  recommendIdList: string[];

  @Column({ type: 'varchar', length: 32 })
  username: string;

  @Column({ type: 'varchar', length: 64 })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;
}
