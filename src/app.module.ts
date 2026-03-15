import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTAuthStrategy } from './common/guards/auth/jwt-auth.strategy';
import { BasicAuthStrategy } from './common/guards/auth/basic-auth.strategy';
import { UtilModule } from './modules/utils/utils.module';
import { ReportModule } from './modules/report/report.module';
// PTC - Web nghe truyện
import { CategoryModule } from './modules/category/category.module';
import { StoryModule } from './modules/story/story.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { UploadModule } from './modules/upload/upload.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { StoryReviewModule } from './modules/story-review/story-review.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { ListeningHistoryModule } from './modules/listening-history/listening-history.module';
import { CommentModule } from './modules/comment/comment.module';
import { BannerModule } from './modules/banner/banner.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: false,
    }),
    UtilModule,
    ReportModule,
    // PTC - Web nghe truyện
    CategoryModule,
    UploadModule,
    StoryModule,
    ChapterModule,
    TransactionModule,
    PurchaseModule,
    UserProfileModule,
    StoryReviewModule,
    BookmarkModule,
    ListeningHistoryModule,
    CommentModule,
    BannerModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JWTAuthStrategy, BasicAuthStrategy],
})
export class AppModule {}