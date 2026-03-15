import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserCredential } from './entity/user-credential.entity';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCredential]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ptc-default-secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserProfileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}