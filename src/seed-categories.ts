import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Category } from './modules/category/entity/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [Category],
      ssl: false,
    }),
    TypeOrmModule.forFeature([Category]),
  ],
})
class SeedModule {}

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const repo = app.get<MongoRepository<Category>>(getRepositoryToken(Category));

  const existing = await repo.count({ where: { isDeleted: false } as any });
  if (existing > 0) {
    console.log(`Already have ${existing} categories. Skipping seed.`);
    await app.close();
    return;
  }

  const now = new Date();
  const handler = { orgId: 'ptc', appId: '', userId: 'system', staffCode: '', roles: [] };
  const owner = { orgId: 'ptc', userId: 'system' };

  const categories = [
    { name: 'Ngôn Tình', slug: 'ngon-tinh', description: 'Truyện tình cảm lãng mạn, ngọt ngào', icon: '💕', sortOrder: 1 },
    { name: 'Truyện Sắc', slug: 'truyen-sac', description: 'Truyện người lớn, 18+', icon: '🔞', sortOrder: 2 },
    { name: 'Tiên Hiệp', slug: 'tien-hiep', description: 'Tu tiên, thần tiên, kiếm hiệp thần thoại', icon: '⚔️', sortOrder: 3 },
    { name: 'Kiếm Hiệp', slug: 'kiem-hiep', description: 'Võ hiệp, giang hồ, kiếm khách', icon: '🗡️', sortOrder: 4 },
    { name: 'Đô Thị', slug: 'do-thi', description: 'Truyện hiện đại, đô thị, đời thường', icon: '🏙️', sortOrder: 5 },
    { name: 'Huyền Huyễn', slug: 'huyen-huyen', description: 'Thế giới huyền ảo, phép thuật, dị giới', icon: '🔮', sortOrder: 6 },
    { name: 'Xuyên Không', slug: 'xuyen-khong', description: 'Du hành thời gian, xuyên không về quá khứ', icon: '⏳', sortOrder: 7 },
    { name: 'Trọng Sinh', slug: 'trong-sinh', description: 'Tái sinh, sống lại kiếp trước', icon: '🔄', sortOrder: 8 },
    { name: 'Trinh Thám', slug: 'trinh-tham', description: 'Phá án, điều tra, bí ẩn, ly kỳ', icon: '🔍', sortOrder: 9 },
    { name: 'Kinh Dị', slug: 'kinh-di', description: 'Ma quỷ, rùng rợn, kinh hoàng', icon: '👻', sortOrder: 10 },
    { name: 'Hài Hước', slug: 'hai-huoc', description: 'Truyện vui, hài hước, giải trí', icon: '😂', sortOrder: 11 },
    { name: 'Lịch Sử', slug: 'lich-su', description: 'Truyện dựa trên lịch sử, cung đấu, triều đại', icon: '📜', sortOrder: 12 },
    { name: 'Quân Sự', slug: 'quan-su', description: 'Chiến tranh, quân đội, binh pháp', icon: '🎖️', sortOrder: 13 },
    { name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong', description: 'Sci-fi, tương lai, công nghệ, vũ trụ', icon: '🚀', sortOrder: 14 },
    { name: 'Đam Mỹ', slug: 'dam-my', description: 'Boy Love, tình yêu đồng giới nam', icon: '🌈', sortOrder: 15 },
    { name: 'Bách Hợp', slug: 'bach-hop', description: 'Girl Love, tình yêu đồng giới nữ', icon: '🌸', sortOrder: 16 },
    { name: 'Cổ Đại', slug: 'co-dai', description: 'Bối cảnh cổ đại, cung đình, hoàng cung', icon: '🏯', sortOrder: 17 },
    { name: 'Ngược', slug: 'nguoc', description: 'Truyện ngược, nước mắt, đau lòng', icon: '💔', sortOrder: 18 },
    { name: 'Sủng', slug: 'sung', description: 'Truyện sủng, cưng chiều, ngọt ngào', icon: '🍯', sortOrder: 19 },
    { name: 'Nữ Cường', slug: 'nu-cuong', description: 'Nữ chính mạnh mẽ, độc lập', icon: '💪', sortOrder: 20 },
    { name: 'Doanh Thương', slug: 'doanh-thuong', description: 'Kinh doanh, thương trường, CEO', icon: '💼', sortOrder: 21 },
    { name: 'Truyện Ma', slug: 'truyen-ma', description: 'Truyện ma Việt Nam, tâm linh, liêu trai', icon: '🕯️', sortOrder: 22 },
    { name: 'Truyện Cười', slug: 'truyen-cuoi', description: 'Truyện cười dân gian, tiếu lâm', icon: '🤣', sortOrder: 23 },
    { name: 'Sách Nói', slug: 'sach-noi', description: 'Sách nói self-help, kỹ năng, kiến thức', icon: '📚', sortOrder: 24 },
    { name: 'Thiếu Nhi', slug: 'thieu-nhi', description: 'Truyện thiếu nhi, cổ tích, đồng thoại', icon: '🧸', sortOrder: 25 },
  ];

  const docs = categories.map((cat) => {
    const entity = new Category();
    entity.name = cat.name;
    entity.slug = cat.slug;
    entity.description = cat.description;
    entity.icon = cat.icon;
    entity.storyCount = 0;
    entity.sortOrder = cat.sortOrder;
    entity.status = 'active';
    entity.createdAt = now;
    entity.changedAt = now;
    entity.owner = owner as any;
    entity.createdBy = handler;
    entity.changedBy = handler;
    entity.deletedBy = handler;
    entity.isDeleted = false;
    entity.metadata = {};
    return entity;
  });

  const result = await repo.save(docs);
  console.log(`Inserted ${result.length} categories successfully!`);

  await app.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});