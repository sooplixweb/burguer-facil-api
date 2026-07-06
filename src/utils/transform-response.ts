import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';

export function toResponse<T, V>(dto: ClassConstructor<T>, value: V[]): T[];
export function toResponse<T, V>(dto: ClassConstructor<T>, value: V): T;
export function toResponse<T, V>(
  dto: ClassConstructor<T>,
  value: V | V[],
): T | T[] {
  return plainToInstance(dto, value, {
    excludeExtraneousValues: true,
  });
}
