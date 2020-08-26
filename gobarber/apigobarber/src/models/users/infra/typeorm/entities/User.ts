import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  avatar: string;

  @Expose({ name: 'avatar_url' })
  getavatar_url(): string | null {

    if (!this.avatar) return null;

    switch (uploadConfig.driver) {

      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;

      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3-sa-east-1.amazonaws.com/${this.avatar}`;
    }
  }
}

export default User;
