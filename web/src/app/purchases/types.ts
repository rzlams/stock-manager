export interface PurchaseLineItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface PurchaseBase {
  id: string
  number: string
  supplierId: string
  supplierReference: string
  date: string
  status: 'draft' | 'sent' | 'approved' | 'cancelled' | 'completed'
  expectedDeliveryDate: string
  notes?: string
  lineItems: PurchaseLineItem[]
  totalAmount: number
  taxAmount: number
  grandTotal: number
}

export interface PurchaseOrder extends PurchaseBase {
  type: 'order'
  deliveredItems: number
}

export interface PurchaseBill extends PurchaseBase {
  type: 'bill'
  purchaseOrderId?: string
  billNumber: string
  paymentTerms: 'immediate' | 'net15' | 'net30' | 'net45' | 'net60'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  paidAmount: number
  dueDate: string
}

export type Purchase = PurchaseOrder | PurchaseBill
