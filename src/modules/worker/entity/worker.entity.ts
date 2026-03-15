import { Entity, Column, Index } from 'typeorm';
import { IsString, IsDate, IsBoolean, IsObject } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.EKYC_WORKER)
export class Worker extends Base {
  @Column()
  @Index({ unique: true })
  @IsString()
  socketId: string;

  @Column()
  @IsString()
  type: string; // 'service' or 'user'

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  ipAddress: string;

  @Column()
  @IsString()
  authMethod: string; // 'Service Token' or 'JWT Token'

  @Column()
  @IsDate()
  connectedAt: Date;

  @Column({ nullable: true })
  @IsDate()
  disconnectedAt: Date;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'simple-json', nullable: true })
  @IsObject()
  metadata: any; // Additional info
}
