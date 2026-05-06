import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { InternalServiceTokenGuard } from './guards/internal-service-token.guard';
import { FileService } from './services/file.service';
import { StorageService } from './services/storage.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, StorageService, InternalServiceTokenGuard],
})
export class AppModule {}
