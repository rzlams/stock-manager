'use client'

import { PurchaseDrawer } from '@/app/purchases/purchase-drawer'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { FileText, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Purchase, PurchaseOrder } from './types'

const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: '#PO001',
    number: 'PO-2024-001',
    supplierId: 'SUP001',
    supplierReference: 'REF-001',
    date: '2024-03-15',
    status: 'approved',
    expectedDeliveryDate: '2024-03-30',
    notes: 'Regular monthly order',
    lineItems: [
      {
        id: 'LI001',
        productId: 'PRD001',
        productName: 'Modern Desk Lamp',
        quantity: 10,
        unitPrice: 59.99,
        total: 599.9,
      },
    ],
    totalAmount: 599.9,
    taxAmount: 60,
    grandTotal: 659.9,
    type: 'order',
    deliveredItems: 0,
  },
  {
    id: '#PO002',
    number: 'PO-2024-002',
    supplierId: 'SUP002',
    supplierReference: 'REF-002',
    date: '2024-03-16',
    status: 'draft',
    expectedDeliveryDate: '2024-04-01',
    notes: 'New supplier order',
    lineItems: [
      {
        id: 'LI002',
        productId: 'PRD002',
        productName: 'Wireless Earbuds',
        quantity: 5,
        unitPrice: 129.99,
        total: 649.95,
      },
    ],
    totalAmount: 649.95,
    taxAmount: 65,
    grandTotal: 714.95,
    type: 'order',
    deliveredItems: 0,
  },
]

interface PurchaseOrdersTableProps {
  searchQuery: string
}

export function PurchaseOrdersTable({ searchQuery }: PurchaseOrdersTableProps) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null)

  const filteredOrders = purchaseOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      order.number.toLowerCase().includes(searchLower) ||
      order.supplierReference.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    )
  })

  const handleEditPurchase = (purchase: PurchaseOrder) => {
    setSelectedPurchase(purchase)
    setIsDrawerOpen(true)
  }

  const handleAddPurchase = () => {
    setSelectedPurchase(null)
    setIsDrawerOpen(true)
  }

  const handleConvertToBill = (purchase: PurchaseOrder) => {
    setSelectedPurchase(purchase)
    setIsDrawerOpen(true)
  }

  const handleSavePurchase = (updatedPurchase: Partial<Purchase>) => {
    if (selectedPurchase) {
      // Update existing purchase
      setPurchaseOrders(purchaseOrders.map((p) => (p.id === selectedPurchase.id ? ({ ...p, ...updatedPurchase } as PurchaseOrder) : p)))
    } else {
      // Add new purchase
      const newPurchase: PurchaseOrder = {
        id: `#PO${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        number: updatedPurchase.number || '',
        supplierId: updatedPurchase.supplierId || '',
        supplierReference: updatedPurchase.supplierReference || '',
        date: updatedPurchase.date || new Date().toISOString().split('T')[0],
        status: (updatedPurchase.status as PurchaseOrder['status']) || 'draft',
        expectedDeliveryDate: updatedPurchase.expectedDeliveryDate || '',
        notes: updatedPurchase.notes,
        lineItems: updatedPurchase.lineItems || [],
        totalAmount: updatedPurchase.totalAmount || 0,
        taxAmount: updatedPurchase.taxAmount || 0,
        grandTotal: updatedPurchase.grandTotal || 0,
        type: 'order',
        deliveredItems: (updatedPurchase as Partial<PurchaseOrder>).deliveredItems || 0,
      }
      setPurchaseOrders([...purchaseOrders, newPurchase])
    }
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden" data-testid="purchases-table">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 border-neutral-200 border-b">
                <TableHead className="font-medium text-neutral-600">PO Number</TableHead>
                <TableHead className="font-medium text-neutral-600">Supplier Ref</TableHead>
                <TableHead className="font-medium text-neutral-600">Date</TableHead>
                <TableHead className="font-medium text-neutral-600">Expected Delivery</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Total</TableHead>
                <TableHead className="font-medium text-neutral-600">Status</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((purchase) => (
                <TableRow key={purchase.id} className="border-neutral-200 border-b">
                  <TableCell className="font-medium text-neutral-700">{purchase.number}</TableCell>
                  <TableCell className="text-neutral-700">{purchase.supplierReference}</TableCell>
                  <TableCell className="text-neutral-600">{new Date(purchase.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-neutral-600">{new Date(purchase.expectedDeliveryDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-neutral-700 text-right">${purchase.grandTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={purchase.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-primary"
                        onClick={() => handleConvertToBill(purchase)}
                        title="Convert to Bill"
                      >
                        <FileText size={18} />
                        <span className="sr-only">Convert to Bill</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-primary" onClick={() => handleEditPurchase(purchase)}>
                        <Pencil size={18} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-danger">
                        <Trash2 size={18} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-neutral-200 border-t">
          <p className="text-neutral-600 text-sm">
            Showing 1 to {filteredOrders.length} of {filteredOrders.length} purchase orders
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="border-neutral-300 text-sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary-light border-primary-light text-primary text-sm">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-300 text-sm" disabled>
              Next
            </Button>
          </div>
        </div>
        {/* Hidden button for external triggering */}
        <button className="hidden" data-action="add-purchase" onClick={handleAddPurchase} />
      </div>

      <PurchaseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        purchase={selectedPurchase}
        onSave={handleSavePurchase}
        type="order"
      />
    </>
  )
}

function StatusBadge({ status }: { status: PurchaseOrder['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'draft' && 'bg-neutral-100 text-neutral-700',
        status === 'sent' && 'bg-primary-light text-primary-dark',
        status === 'approved' && 'bg-success-light text-success-dark',
        status === 'cancelled' && 'bg-danger-light text-danger-dark',
        status === 'completed' && 'bg-success-light text-success-dark'
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
