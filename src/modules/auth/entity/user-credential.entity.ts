import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Entity('user-credentials')
export class UserCredential extends Base {
  @Column()
  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  passwordHash: string = ''; // bcrypt hash

  @Column()
  @IsString()
  displayName: string = '';

  @Column()
  @IsString()
  phone: string = '';

  @Column()
  @IsEnum(AuthProvider)
  provider: string = AuthProvider.LOCAL;

  @Column()
  @IsString()
  providerId: string = ''; // Google/Facebook ID

  @Column()
  @IsString()
  role: string = 'org.customer'; // default role

  @Column()
  @IsString()
  orgId: string = 'ptc'; // default org

  @Column()
  @IsBoolean()
  isVerified: boolean = false;

  @Column()
  @IsBoolean()
  isActive: boolean = true;

  @Column()
  @IsString()
  refreshToken: string = ''; // hashed refresh token

  @Column()
  @IsDate()
  lastLoginAt: Date;
}