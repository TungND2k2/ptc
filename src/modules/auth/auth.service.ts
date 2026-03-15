import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserCredential, AuthProvider } from './entity/user-credential.entity';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserCredential)
    private credentialRepository: MongoRepository<UserCredential>,
    private readonly jwtService: JwtService,
    private readonly userProfileService: UserProfileService,
  ) {}

  /**
   * Đăng ký tài khoản mới
   */
  async register(
    email: string,
    password: string,
    displayName: string,
    phone?: string,
  ) {
    // Kiểm tra email đã tồn tại
    const existing = await this.credentialRepository.findOne({
      where: { email: email.toLowerCase(), isDeleted: false } as any,
    });
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo credential
    const credential = new UserCredential();
    credential.email = email.toLowerCase();
    credential.passwordHash = passwordHash;
    credential.displayName = displayName;
    credential.phone = phone || '';
    credential.role = process.env.APP_ROLE_CUSTOMER || 'org.customer';
    credential.orgId = process.env.PTC_DEFAULT_ORG_ID || 'ptc';
    credential.isVerified = true; // TODO: email verification flow
    credential.isActive = true;

    const saved = await this.credentialRepository.save(credential);

    // Tạo UserProfile tương ứng
    await this.userProfileService.getOrCreateProfile(
      saved.id.toString(),
      displayName,
    );

    return {
      success: true,
      userId: saved.id.toString(),
      email: saved.email,
      displayName: saved.displayName,
    };
  }

  /**
   * Đăng nhập
   */
  async login(email: string, password: string) {
    const credential = await this.credentialRepository.findOne({
      where: { email: email.toLowerCase(), isDeleted: false } as any,
    });

    if (!credential) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!credential.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khoá');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, credential.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Generate tokens
    const tokens = await this.generateTokens(credential);

    // Lưu refresh token (hashed)
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    credential.refreshToken = refreshHash;
    credential.lastLoginAt = new Date();
    await this.credentialRepository.save(credential);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 3600,
      user: {
        id: credential.id.toString(),
        email: credential.email,
        displayName: credential.displayName,
        role: credential.role,
      },
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string) {
    // Verify refresh token
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const credential = await this.credentialRepository.findOne({
      where: { email: payload.email, isDeleted: false } as any,
    });

    if (!credential || !credential.isActive) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khoá');
    }

    // Verify stored refresh token matches
    if (!credential.refreshToken) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }

    const isRefreshValid = await bcrypt.compare(refreshToken, credential.refreshToken);
    if (!isRefreshValid) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(credential);

    // Update refresh token
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    credential.refreshToken = refreshHash;
    await this.credentialRepository.save(credential);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 3600,
    };
  }

  /**
   * Đăng nhập bằng Google ID Token (từ frontend)
   * Flow: Frontend dùng Google Sign-In SDK → lấy idToken → gửi về BE
   */
  async googleLogin(idToken: string) {
    // Verify Google ID token
    let googlePayload: any;
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
      );
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      googlePayload = await response.json();
    } catch {
      throw new UnauthorizedException('Google ID token không hợp lệ');
    }

    // Verify audience matches our client ID
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && googlePayload.aud !== clientId) {
      throw new UnauthorizedException('Google token không dành cho ứng dụng này');
    }

    const email = googlePayload.email?.toLowerCase();
    const googleId = googlePayload.sub;
    const displayName = googlePayload.name || googlePayload.email;
    const avatar = googlePayload.picture || '';

    if (!email) {
      throw new UnauthorizedException('Không lấy được email từ Google');
    }

    // Tìm credential theo email
    let credential = await this.credentialRepository.findOne({
      where: { email, isDeleted: false } as any,
    });

    if (credential) {
      // Đã có tài khoản → cập nhật provider info nếu chưa có
      if (credential.provider === AuthProvider.LOCAL) {
        credential.provider = AuthProvider.GOOGLE;
        credential.providerId = googleId;
      }
      if (!credential.isActive) {
        throw new UnauthorizedException('Tài khoản đã bị khoá');
      }
    } else {
      // Chưa có → tạo tài khoản mới
      credential = new UserCredential();
      credential.email = email;
      credential.displayName = displayName;
      credential.provider = AuthProvider.GOOGLE;
      credential.providerId = googleId;
      credential.role = process.env.APP_ROLE_CUSTOMER || 'org.customer';
      credential.orgId = process.env.PTC_DEFAULT_ORG_ID || 'ptc';
      credential.isVerified = true;
      credential.isActive = true;

      credential = await this.credentialRepository.save(credential);

      // Tạo UserProfile
      await this.userProfileService.getOrCreateProfile(
        credential.id.toString(),
        displayName,
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(credential);

    // Lưu refresh token
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    credential.refreshToken = refreshHash;
    credential.lastLoginAt = new Date();
    await this.credentialRepository.save(credential);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 3600,
      user: {
        id: credential.id.toString(),
        email: credential.email,
        displayName: credential.displayName,
        role: credential.role,
        provider: credential.provider,
      },
    };
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const credential = await this.credentialRepository.findOne({
      where: { _id: userId } as any,
    });

    if (!credential) {
      throw new BadRequestException('Không tìm thấy tài khoản');
    }

    const isMatch = await bcrypt.compare(currentPassword, credential.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const salt = await bcrypt.genSalt(10);
    credential.passwordHash = await bcrypt.hash(newPassword, salt);
    await this.credentialRepository.save(credential);

    return { success: true, message: 'Đổi mật khẩu thành công' };
  }

  /**
   * Đăng xuất (xoá refresh token)
   */
  async logout(userId: string) {
    const credential = await this.credentialRepository.findOne({
      where: { _id: userId } as any,
    });

    if (credential) {
      credential.refreshToken = '';
      await this.credentialRepository.save(credential);
    }

    return { success: true };
  }

  /**
   * Generate access + refresh token
   * Token format tương thích với JWTAuthStrategy hiện tại
   */
  private async generateTokens(credential: UserCredential) {
    const userId = credential.id.toString();

    // Access token - format giống Keycloak để RolesGuard hoạt động
    const accessPayload = {
      sub: userId,
      name: credential.displayName,
      email: credential.email,
      phone: credential.phone,
      orgId: credential.orgId,
      realm_access: {
        roles: [credential.role],
      },
      roles: [credential.role],
      user: {
        id: userId,
        fullname: credential.displayName,
        orgId: credential.orgId,
        attributes: {
          id: userId,
          email: credential.email,
          phone: credential.phone,
        },
      },
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    // Refresh token - longer expiry
    const refreshPayload = {
      sub: userId,
      email: credential.email,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}