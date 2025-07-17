import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('instagram_profiles')
export class InstagramProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bussinessId: string;
  @Column()
  username: string;

  @Column({ name: 'profile_picture_url', type: 'text', nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ name: 'followers_count', type: 'int', default: 0 })
  followersCount: number;

  @Column({ name: 'follows_count', type: 'int', default: 0 })
  followsCount: number;

  @Column({ name: 'media_count', type: 'int', default: 0 })
  mediaCount: number;
}
