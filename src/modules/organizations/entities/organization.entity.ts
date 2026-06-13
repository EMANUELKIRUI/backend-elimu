export class OrganizationEntity {
  id: string;
  parentId?: string;
  tenantId: string;
  name: string;
  type: string;
  status?: string;
  country?: string;
  region?: string;
  county?: string;
  createdAt?: Date;
}
