import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Req,
  ValidationPipe,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  RegisterResponseDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  ChangePasswordDto,
  GoogleLoginDto,
} from './dto/auth.dto';

const Public = () => SetMetadata('public', true);

@ApiTags('Auth')
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_AUTH)
@Controller(Controllers.PTC_AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản mới với email/password. Không cần xác thực.',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      register: {
        summary: 'Đăng ký user mới',
        value: {
          email: 'user@example.com',
          password: 'mypassword123',
          displayName: 'Nguyễn Văn A',
          phone: '0901234567',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công', type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() data: RegisterDto): Promise<RegisterResponseDto> {
    return await this.authService.register(
      data.email,
      data.password,
      data.displayName,
      data.phone,
    );
  }

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập bằng email/password. Trả về accessToken (1h) + refreshToken (7 ngày).\n\n' +
                 'Dùng accessToken trong header: `Authorization: Bearer <accessToken>`',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      login: {
        summary: 'Đăng nhập',
        value: { email: 'user@example.com', password: 'mypassword123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(data.email, data.password);
  }

  @Post('refresh-token')
  @Public()
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Dùng refreshToken để lấy accessToken mới khi token cũ hết hạn.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      refresh: {
        summary: 'Refresh token',
        value: { refreshToken: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Token mới', type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async refreshToken(@Body() data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(data.refreshToken);
  }

  @Post('google')
  @Public()
  @ApiOperation({
    summary: 'Đăng nhập bằng Google',
    description:
      'Frontend dùng Google Sign-In SDK để lấy ID token, sau đó gửi về endpoint này.\n\n' +
      'Flow:\n' +
      '1. Frontend: User click "Đăng nhập bằng Google" → Google SDK trả về `idToken`\n' +
      '2. Frontend: Gửi `POST /auth/google` với body `{ idToken }`\n' +
      '3. Backend: Verify token với Google → tạo/tìm tài khoản → trả JWT\n\n' +
      'Nếu email chưa tồn tại → tự động tạo tài khoản mới.\n' +
      'Nếu email đã tồn tại (đăng ký bằng email/password) → liên kết với Google.',
  })
  @ApiBody({
    type: GoogleLoginDto,
    examples: {
      google: {
        summary: 'Google login',
        value: { idToken: 'eyJhbGciOiJSUzI1NiIs...' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập Google thành công', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Google token không hợp lệ' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async googleLogin(@Body() data: GoogleLoginDto): Promise<LoginResponseDto> {
    return await this.authService.googleLogin(data.idToken);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Mật khẩu hiện tại không đúng' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async changePassword(@Body() data: ChangePasswordDto, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.authService.changePassword(userId, data.currentPassword, data.newPassword);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất (invalidate refresh token)' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  async logout(@Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.authService.logout(userId);
  }
}