import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product-entity';
import { ProductRequestDto } from 'src/dtos/request/product-request.dto';
import { UpdateProductRequestDto } from 'src/dtos/request/update-product.dto';
import { ImageService } from './image.service';
import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
    private readonly imageService: ImageService,
  ) {}

  async create(dto: ProductRequestDto, files?: Express.Multer.File[]) {
    this.logger.log('Criando produto');
    this.logger.debug(`Payload recebido: ${JSON.stringify(dto)}`);

    const product = this.repo.create({
      ...dto,
      stockEnabled: Boolean(dto.stockEnabled),
      price: dto.price.toString(),
      promoPrice: dto.promoPrice?.toString(),
      isActive:
        dto.isActive === ProductStatusEnum.ACTIVED
          ? ProductStatusEnum.ACTIVED
          : ProductStatusEnum.DISABLED,
    });

    await this.repo.save(product);
    this.logger.log(`Produto criado com ID: ${product.id}`);

    if (files?.length) {
      this.logger.log(
        `Salvando ${files.length} imagens para o produto ${product.id}`,
      );
      const images = await this.imageService.saveAll(files, product);
      product.images = images;
      await this.repo.save(product);
      this.logger.log(`Imagens salvas para o produto ${product.id}`);
    }

    return this.findOne(product.id);
  }

  findAll() {
    this.logger.log('Buscando lista de produtos');
    return this.repo.find({
      relations: ['images'],
    });
  }

  async findOne(id: string) {
    this.logger.log(`Buscando produto pelo ID: ${id}`);

    const product = await this.repo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      this.logger.warn(`Produto não encontrado: ${id}`);
      throw new NotFoundException('Produto não encontrado');
    }

    this.logger.log(`Produto encontrado: ${id}`);
    return product;
  }

  async update(id: string, dto: UpdateProductRequestDto) {
    this.logger.log(`Atualizando produto: ${id}`);
    this.logger.debug(`Payload de atualização: ${JSON.stringify(dto)}`);

    const product = await this.findOne(id);
    Object.assign(product, dto);

    const updated = await this.repo.save(product);
    this.logger.log(`Produto atualizado com sucesso: ${id}`);

    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Removendo produto: ${id}`);

    const product = await this.findOne(id);
    await this.repo.remove(product);

    this.logger.log(`Produto removido com sucesso: ${id}`);
    return { message: 'Produto removido com sucesso' };
  }

  async actived(id: string, status: ProductStatusEnum) {
    this.logger.log(`Alterando status do produto ${id} para ${status}`);

    await this.findOne(id);
    await this.repo.update(id, { isActive: status });

    this.logger.log(`Status do produto ${id} atualizado para ${status}`);
    return { message: `Produto ${status}` };
  }
}
