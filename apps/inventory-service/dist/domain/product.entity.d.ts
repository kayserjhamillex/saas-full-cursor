export type ProductEntity = {
    id: string;
    tenantId: string;
    categoryId: string;
    subcategoryId: string | null;
    sku: string;
    name: string;
    unit: string;
    createdAt: Date;
    deletedAt: Date | null;
};
