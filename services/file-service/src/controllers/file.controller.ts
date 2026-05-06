import { Body, Controller, Get, Param, Query, Post } from '@nestjs/common';
import { FileService } from '../services/file.service';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  upload(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      sourceModule?: string;
      fileName?: string;
      mimeType?: string;
      fileBase64?: string;
    },
  ) {
    return this.fileService.uploadFile(body);
  }

  @Get(':fileId')
  getById(
    @Param('fileId') fileId: string,
    @Query('tenantId') tenantId: string | undefined,
  ) {
    return this.fileService.getFileMetadata(fileId, tenantId);
  }
}
