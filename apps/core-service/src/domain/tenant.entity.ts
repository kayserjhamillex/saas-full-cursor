export type TenantStatus = 'active' | 'inactive';

export type TenantEntity = {
  id: string;
  name: string;
  status: TenantStatus;
  createdAt?: Date;
  deletedAt?: Date | null;
};
