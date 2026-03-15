import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserCredential } from './modules/auth/entity/user-credential.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [UserCredential],
      ssl: false,
    }),
    TypeOrmModule.forFeature([UserCredential]),
  ],
})
class SeedModule {}

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const repo = app.get<MongoRepository<UserCredential>>(getRepositoryToken(UserCredential));

  const adminEmail = 'admin@ptc.vn';

  // Check if admin already exists
  const existing = await repo.findOne({
    where: { email: adminEmail, isDeleted: false } as any,
  });

  if (existing) {
    console.log(`Admin account already exists: ${adminEmail}`);
    await app.close();
    return;
  }

  // Create admin
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  const admin = new UserCredential();
  admin.email = adminEmail;
  admin.passwordHash = passwordHash;
  admin.displayName = 'PTC Admin';
  admin.phone = '';
  admin.provider = 'local';
  admin.providerId = '';
  admin.role = 'org.owner'; // Full admin access
  admin.orgId = 'ptc';
  admin.isVerified = true;
  admin.isActive = true;
  admin.refreshToken = '';
  admin.createdAt = new Date();
  admin.changedAt = new Date();
  admin.isDeleted = false;
  admin.metadata = {};
  admin.owner = { orgId: 'ptc', userId: 'system' } as any;
  admin.createdBy = { orgId: 'ptc', appId: '', userId: 'system', staffCode: '', roles: [] };
  admin.changedBy = { orgId: 'ptc', appId: '', userId: 'system', staffCode: '', roles: [] };
  admin.deletedBy = { orgId: 'ptc', appId: '', userId: 'system', staffCode: '', roles: [] };

  const saved = await repo.save(admin);
  console.log(`Admin account created!`);
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: admin123`);
  console.log(`  Role:     org.owner`);
  console.log(`  ID:       ${saved.id}`);

  await app.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
