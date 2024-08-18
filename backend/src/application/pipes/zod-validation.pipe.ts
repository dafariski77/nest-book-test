import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private zodType: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type == 'body') {
      return this.zodType.parse(value);
    } else {
      return value;
    }
  }
}
