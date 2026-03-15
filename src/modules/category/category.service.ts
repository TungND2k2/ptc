import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: MongoRepository<Category>,
  ) {
    super(categoryRepository);
  }

  /**
   * Tìm category theo slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { slug, isDeleted: false } as any,
    });
  }

  /**
   * Tăng storyCount khi có truyện mới thuộc category
   */
  async incrementStoryCount(categoryId: string, increment: number = 1): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { _id: categoryId } as any,
    });
    if (category) {
      category.storyCount = (category.storyCount || 0) + increment;
      await this.categoryRepository.save(category);
    }
  }
}