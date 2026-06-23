import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';
import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';
import { ProductRequestDto } from 'src/dtos/request/product-request.dto';
import { UpdateProductRequestDto } from 'src/dtos/request/update-product.dto';
import { ProductResponseDto } from 'src/dtos/response/product-response.dto';
import { ProductsService } from 'src/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: ProductRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return plainToInstance(
      ProductResponseDto,
      await this.productsService.create(dto, files),
    );
  }

  @Get()
  async findAll() {
    return plainToInstance(
      ProductResponseDto,
      await this.productsService.findAll(),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return plainToInstance(
      ProductResponseDto,
      await this.productsService.findOne(id),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductRequestDto) {
    return plainToInstance(
      ProductResponseDto,
      await this.productsService.update(id, dto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/status')
  actived(@Param('id') id: string, @Body('status') status: ProductStatusEnum) {
    return this.productsService.actived(id, status);
  }
}
