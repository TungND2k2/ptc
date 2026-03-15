import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

// Mở rộng type Request trong file này
interface CustomRequest extends Request {
  user?: DataHandler | any; // Có thể là DataHandler hoặc dữ liệu từ JWT
}

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt-auth') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<CustomRequest>();

    // Nếu có lỗi hoặc không có user (token không hợp lệ), gán req.user = handler
    if (err || !user) {
      const handler = new DataHandler();
      req.user = handler;
      return handler; // Trả về handler để tiếp tục
    }

    // Nếu verify thành công, gán req.user bằng user từ validate
    req.user = user;
    return user;
  }

  // Đảm bảo canActivate luôn cho phép request đi tiếp
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    super.canActivate(context); // Gọi để chạy logic xác thực
    return true; // Luôn cho phép, bất kể xác thực thành công hay không
  }
}
