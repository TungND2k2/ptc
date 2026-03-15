import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

// ==================== REGISTER ====================
export class RegisterDto {
  @ApiProperty({
    description: 'Email đăng ký',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: 'mypassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Tên hiển thị',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0901234567',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class RegisterResponseDto {
  @ApiProperty({ description: 'Đăng ký thành công', example: true })
  success: boolean;

  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  userId: string;

  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Tên hiển thị', example: 'Nguyễn Văn A' })
  displayName: string;
}

// ==================== LOGIN ====================
export class LoginDto {
  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'mypassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Access token (JWT)', example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token', example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token hết hạn (giây)', example: 3600 })
  expiresIn: number;

  @ApiProperty({ description: 'Thông tin user' })
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

// ==================== REFRESH TOKEN ====================
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token từ login response',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'Access token mới' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token mới' })
  refreshToken: string;

  @ApiProperty({ description: 'Hết hạn (giây)', example: 3600 })
  expiresIn: number;
}

// ==================== GOOGLE LOGIN (từ Frontend) ====================
export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID token từ frontend (sau khi user đăng nhập Google trên client)',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

// ==================== CHANGE PASSWORD ====================
export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới (tối thiểu 6 ký tự)', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}