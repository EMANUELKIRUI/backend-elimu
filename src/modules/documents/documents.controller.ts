import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Permissions('documents.view')
  documents(@CurrentUser() user: AuthUser) {
    return this.documentsService.documents(user);
  }

  @Post()
  @Permissions('documents.manage')
  createDocument(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.documentsService.createDocument(user, body);
  }

  @Get('folders')
  @Permissions('documents.view')
  folders(@CurrentUser() user: AuthUser) {
    return this.documentsService.folders(user);
  }

  @Post('folders')
  @Permissions('documents.manage')
  createFolder(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.documentsService.createFolder(user, body);
  }

  @Post(':documentId/versions')
  @Permissions('documents.manage')
  createVersion(
    @CurrentUser() user: AuthUser,
    @Param('documentId') documentId: string,
    @Body() body: any,
  ) {
    return this.documentsService.createVersion(user, documentId, body);
  }

  @Post(':documentId/permissions')
  @Permissions('documents.manage')
  grantPermission(
    @CurrentUser() user: AuthUser,
    @Param('documentId') documentId: string,
    @Body() body: any,
  ) {
    return this.documentsService.grantPermission(user, documentId, body);
  }
}
