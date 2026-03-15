import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsArray, IsDate } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

export enum UserRole {
  USER = 'user',
  AUTHOR = 'author',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  INACTIVE = 'inactive',
}

@Entity(Controllers.PTC_USER_PROFILE)
export class UserProfile extends Base {
  @Column()
  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  userId: string; // từ JWT/Keycloak

  @Column()
  @IsString()
  displayName: string = '';

  @Column()
  @IsString()
  email: string = '';

  @Column()
  @IsString()
  phone: string = '';

  @Column()
  @IsString()
  avatarKey: string = ''; // S3 object key

  @Column()
  @IsString()
  bio: string = '';

  @Column()
  @IsEnum(UserRole)
  role: string = UserRole.USER;

  @Column()
  @IsEnum(UserStatus)
  status: string = UserStatus.ACTIVE;

  @Column()
  @IsArray()
  favoriteCategories: string[] = []; // category IDs yêu thích

  @Column()
  @IsNumber()
  totalStoriesRead: number = 0;

  @Column()
  @IsNumber()
  totalListeningTime: number = 0; // tổng giây đã nghe

  @Column()
  @IsDate()
  lastActiveAt: Date;
}