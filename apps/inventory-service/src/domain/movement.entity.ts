export type MovementEntity = {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  movementType: 'entry' | 'exit' | 'transfer_out' | 'transfer_in';
  quantity: number;
  reference: string | null;
  notes: string | null;
  transferId: string | null;
  createdAt: Date;
};
