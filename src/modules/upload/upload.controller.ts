import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { StorageService } from './storage.service';
import {
  PresignPutDto,
  PresignPutResponseDto,
  PresignGetDto,
  PresignGetResponseDto,
} from './dto/upload.dto';
import { AllowedContentType } from './enum/upload.enum';

@ApiTags('Upload')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_UPLOAD)
@Controller(Controllers.PTC_UPLOAD)
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presign-put')
  @ApiOperation({
    summary: 'Lấy presigned URL để upload file lên S3',
    description:
      '**Workflow upload file:**\n\n' +
      '1. Gọi API này với folder, fileName, contentType\n' +
      '2. Nhận `uploadUrl` và `fileKey`\n' +
      '3. Client dùng PUT request gửi file binary lên `uploadUrl`\n' +
      '4. Lưu `fileKey` khi tạo/cập nhật story hoặc chapter\n\n' +
      '**Lưu ý:** URL hết hạn sau 10 phút. File upload trực tiếp từ client lên S3, không qua backend.',
  })
  @ApiBody({
    type: PresignPutDto,
    examples: {
      coverImage: {
        summary: 'Upload ảnh bìa truyện',
        value: {
          folder: 'stories/covers',
          fileName: 'dau-pha-thuong-khung.jpg',
          contentType: 'image/jpeg',
          size: 512000,
        },
      },
      chapterAudio: {
        summary: 'Upload audio chương',
        value: {
          folder: 'chapters/audio',
          fileName: 'chuong-1.mp3',
          contentType: 'audio/mpeg',
          size: 52428800,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Presigned URL tạo thành công', type: PresignPutResponseDto })
  @ApiResponse({ status: 400, description: 'Content type không được hỗ trợ' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async presignPut(@Body() data: PresignPutDto): Promise<PresignPutResponseDto> {
    // Validate content type
    const allowedTypes = Object.values(AllowedContentType) as string[];
    if (!allowedTypes.includes(data.contentType)) {
      throw new BadRequestException(
        `Content type không được hỗ trợ: ${data.contentType}. Cho phép: ${allowedTypes.join(', ')}`,
      );
    }

    const fileKey = this.storageService.generateObjectKey(data.folder, data.fileName);
    const { uploadUrl, expiresIn } = await this.storageService.generatePresignedUploadUrl(
      fileKey,
      data.contentType,
      600, // 10 phút
    );

    return {
      uploadUrl,
      fileKey,
      method: 'PUT',
      headers: {
        'Content-Type': data.contentType,
      },
      expiresIn,
    };
  }

  @Post('presign-get')
  @ApiOperation({
    summary: 'Lấy presigned URL để download/view file từ S3',
    description: 'Tạo presigned GET URL cho file đã upload. Dùng cho preview ảnh bìa, nghe thử audio, v.v.',
  })
  @ApiBody({
    type: PresignGetDto,
    examples: {
      viewCover: {
        summary: 'Xem ảnh bìa',
        value: {
          fileKey: 'stories/covers/1710000000_cover.jpg',
          expiresIn: 3600,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Presigned download URL', type: PresignGetResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async presignGet(@Body() data: PresignGetDto): Promise<PresignGetResponseDto> {
    const expiresIn = data.expiresIn || 3600;
    const downloadUrl = await this.storageService.generatePresignedDownloadUrl(
      data.fileKey,
      expiresIn,
    );

    return { downloadUrl, expiresIn };
  }
}