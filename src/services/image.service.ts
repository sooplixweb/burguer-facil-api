import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/entities/product-entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repo: Repository<ImageEntity>,
  ) {}

  async saveAll(
    files: Express.Multer.File[],
    product: ProductEntity,
  ): Promise<ImageEntity[]> {
    const images = files.map((file, index) =>
      this.repo.create({
        fileName: file.originalname,
        url: `uploads/${file.filename}`,
        isPrimary: index === 0,
        product,
      }),
    );

    return this.repo.save(images);
  }
}
