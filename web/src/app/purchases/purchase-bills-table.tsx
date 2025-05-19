'use client'

import { PurchaseDrawer } from '@/app/purchases/purchase-drawer'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { Purchase, PurchaseBill } from './types'

const initialPurchaseBills: PurchaseBill[] = [
  {
    id: '#PB001',
    number: 'PB-2024-001',
    supplierId: 'SUP001',
    supplierReference: 'REF-001',
    date: '2024-03-15',
    status: 'completed',
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
    type: 'bill',
    billNumber: 'BILL-001',
    paymentTerms: 'net30',
    paymentStatus: 'paid',
    paidAmount: 659.9,
    dueDate: '2024-04-15',
    purchaseOrderId: '#PO001',
  },
  {
    id: '#PB002',
    number: 'PB-2024-002',
    supplierId: 'SUP002',
    supplierReference: 'REF-002',
    date: '2024-03-16',
    status: 'completed',
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
    type: 'bill',
    billNumber: 'BILL-002',
    paymentTerms: 'net15',
    paymentStatus: 'partial',
    paidAmount: 357.48,
    dueDate: '2024-03-31',
  },
]

interface PurchaseBillsTableProps {
  searchQuery: string
}

export function PurchaseBillsTable({ searchQuery }: PurchaseBillsTableProps) {
  const [purchaseBills, setPurchaseBills] = useState<PurchaseBill[]>(initialPurchaseBills)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseBill | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const filteredBills = purchaseBills.filter((bill) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      bill.billNumber.toLowerCase().includes(searchLower) ||
      bill.supplierReference.toLowerCase().includes(searchLower) ||
      bill.paymentStatus.toLowerCase().includes(searchLower)
    )
  })

  const handleEditPurchase = (purchase: PurchaseBill) => {
    setSelectedPurchase(purchase)
    setIsDrawerOpen(true)
  }

  const handleAddPurchase = () => {
    setSelectedPurchase(null)
    setIsDrawerOpen(true)
  }

  const handleSavePurchase = (updatedPurchase: Partial<Purchase>) => {
    if (selectedPurchase) {
      // Update existing purchase
      setPurchaseBills(purchaseBills.map((p) => (p.id === selectedPurchase.id ? ({ ...p, ...updatedPurchase } as PurchaseBill) : p)))
    } else {
      // Add new purchase
      const newPurchase: PurchaseBill = {
        id: `#PB${String(purchaseBills.length + 1).padStart(3, '0')}`,
        number: updatedPurchase.number || '',
        supplierId: updatedPurchase.supplierId || '',
        supplierReference: updatedPurchase.supplierReference || '',
        date: updatedPurchase.date || new Date().toISOString().split('T')[0],
        status: (updatedPurchase.status as PurchaseBill['status']) || 'draft',
        expectedDeliveryDate: updatedPurchase.expectedDeliveryDate || '',
        notes: updatedPurchase.notes,
        lineItems: updatedPurchase.lineItems || [],
        totalAmount: updatedPurchase.totalAmount || 0,
        taxAmount: updatedPurchase.taxAmount || 0,
        grandTotal: updatedPurchase.grandTotal || 0,
        type: 'bill',
        billNumber: (updatedPurchase as Partial<PurchaseBill>).billNumber || '',
        paymentTerms: (updatedPurchase as Partial<PurchaseBill>).paymentTerms || 'net30',
        paymentStatus: (updatedPurchase as Partial<PurchaseBill>).paymentStatus || 'unpaid',
        paidAmount: (updatedPurchase as Partial<PurchaseBill>).paidAmount || 0,
        dueDate: (updatedPurchase as Partial<PurchaseBill>).dueDate || '',
        purchaseOrderId: (updatedPurchase as Partial<PurchaseBill>).purchaseOrderId,
      }
      setPurchaseBills([...purchaseBills, newPurchase])
    }
  }

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden" data-testid="purchases-table">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 border-neutral-200 border-b">
                <TableHead className="w-8 font-medium text-neutral-600"></TableHead>
                <TableHead className="font-medium text-neutral-600">Bill Number</TableHead>
                <TableHead className="font-medium text-neutral-600">Supplier Ref</TableHead>
                <TableHead className="font-medium text-neutral-600">Date</TableHead>
                <TableHead className="font-medium text-neutral-600">Due Date</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Total</TableHead>
                <TableHead className="font-medium text-neutral-600">Payment Status</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((purchase) => (
                <React.Fragment key={purchase.id}>
                  <TableRow className="border-neutral-200 border-b">
                    <TableCell className="w-8">
                      {purchase.purchaseOrderId && (
                        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => toggleRow(purchase.id)}>
                          {expandedRows.has(purchase.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          <span className="sr-only">Toggle details</span>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-neutral-700">{purchase.billNumber}</TableCell>
                    <TableCell className="text-neutral-700">{purchase.supplierReference}</TableCell>
                    <TableCell className="text-neutral-600">{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-neutral-600">{new Date(purchase.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-neutral-700 text-right">${purchase.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={purchase.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                  {purchase.purchaseOrderId && expandedRows.has(purchase.id) && (
                    <TableRow className="bg-neutral-50">
                      <TableCell colSpan={8} className="p-4">
                        <div className="pl-6 border-primary border-l-2">
                          <h4 className="mb-2 font-medium text-neutral-700">Purchase Order Details</h4>
                          <div className="gap-4 grid grid-cols-2">
                            <div>
                              <p className="text-neutral-600 text-sm">PO Number</p>
                              <p className="font-medium text-neutral-700">{purchase.purchaseOrderId}</p>
                            </div>
                            <div>
                              <p className="text-neutral-600 text-sm">Expected Delivery</p>
                              <p className="font-medium text-neutral-700">{new Date(purchase.expectedDeliveryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-neutral-200 border-t">
          <p className="text-neutral-600 text-sm">
            Showing 1 to {filteredBills.length} of {filteredBills.length} purchase bills
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
        type="bill"
      />
    </>
  )
}

function PaymentStatusBadge({ status }: { status: PurchaseBill['paymentStatus'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'unpaid' && 'bg-danger-light text-danger-dark',
        status === 'partial' && 'bg-warning-light text-warning-dark',
        status === 'paid' && 'bg-success-light text-success-dark'
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
