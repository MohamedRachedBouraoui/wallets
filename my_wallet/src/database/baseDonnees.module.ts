import { Module } from '@nestjs/common';
import { CommonsModule } from 'src/commons/commons.module';

@Module({
  imports: [CommonsModule]
})
export class BaseDonneesModule { }
