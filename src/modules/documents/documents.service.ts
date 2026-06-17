import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  folders(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.documentFolder.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  createFolder(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.documentFolder.create({
      data: {
        schoolId,
        parentId: body.parentId,
        name: body.name,
      },
    });
  }

  documents(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.document.findMany({
      where: { schoolId },
      include: { folder: true, versions: true, permissions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  createDocument(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.document.create({
      data: {
        schoolId,
        folderId: body.folderId,
        title: body.title,
        type: body.type,
        storageKey: body.storageKey,
        fileUrl: body.fileUrl,
        mimeType: body.mimeType,
        sizeBytes: body.sizeBytes,
        status: body.status,
        metadata: body.metadata,
        createdById: user.id,
      },
    });
  }

  createVersion(user: AuthUser, documentId: string, body: any) {
    return this.prisma.$transaction(async (tx) => {
      const document = await tx.document.findFirstOrThrow({
        where: { id: documentId, schoolId: this.requireSchool(user) },
        include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
      });
      const version = (document.versions[0]?.version ?? 0) + 1;

      return tx.documentVersion.create({
        data: {
          documentId,
          version,
          storageKey: body.storageKey,
          fileUrl: body.fileUrl,
          notes: body.notes,
          createdById: user.id,
        },
      });
    });
  }

  async grantPermission(user: AuthUser, documentId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.document.findFirstOrThrow({ where: { id: documentId, schoolId } });

    return this.prisma.documentPermission.create({
      data: {
        documentId,
        roleId: body.roleId,
        userId: body.userId,
        action: body.action,
      },
    });
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
