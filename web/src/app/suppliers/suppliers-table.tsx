'use client'

import { SupplierDrawer } from '@/app/suppliers/supplier-drawer'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  businessType: 'Manufacturer' | 'Distributor' | 'Wholesaler'
  status: 'Active' | 'Inactive' | 'On Hold'
  leadTime: number
  paymentTerms: string
  taxId?: string
  streetAddress?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

const initialSuppliers: Supplier[] = [
  {
    id: '#SUP001',
    name: 'ABC Manufacturing',
    contactPerson: 'John Smith',
    email: 'john@abcmfg.com',
    phone: '+1 (555) 123-4567',
    website: 'www.abcmfg.com',
    businessType: 'Manufacturer',
    status: 'Active',
    leadTime: 14,
    paymentTerms: 'Net 30',
    taxId: 'TAX123456',
    streetAddress: '123 Industrial Ave',
    city: 'Detroit',
    state: 'MI',
    postalCode: '48201',
    country: 'USA',
  },
  {
    id: '#SUP002',
    name: 'Global Distributors Inc',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@globaldist.com',
    phone: '+1 (555) 987-6543',
    website: 'www.globaldist.com',
    businessType: 'Distributor',
    status: 'Active',
    leadTime: 7,
    paymentTerms: 'Net 15',
    taxId: 'TAX789012',
    streetAddress: '456 Commerce St',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'USA',
  },
  {
    id: '#SUP003',
    name: 'Metro Wholesale',
    contactPerson: 'Mike Brown',
    email: 'mike@metrowholesale.com',
    phone: '+1 (555) 456-7890',
    website: 'www.metrowholesale.com',
    businessType: 'Wholesaler',
    status: 'On Hold',
    leadTime: 21,
    paymentTerms: 'Net 45',
    taxId: 'TAX345678',
    streetAddress: '789 Market Blvd',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
  },
]

export function SuppliersTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsDrawerOpen(true)
  }

  const handleAddSupplier = () => {
    setSelectedSupplier(null)
    setIsDrawerOpen(true)
  }

  const handleSaveSupplier = (updatedSupplier: Partial<Supplier>) => {
    if (selectedSupplier) {
      // Update existing supplier
      setSuppliers(suppliers.map((s) => (s.id === selectedSupplier.id ? { ...s, ...updatedSupplier } : s)))
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: `#SUP${String(suppliers.length + 1).padStart(3, '0')}`,
        name: updatedSupplier.name || '',
        contactPerson: updatedSupplier.contactPerson || '',
        email: updatedSupplier.email || '',
        phone: updatedSupplier.phone || '',
        website: updatedSupplier.website,
        businessType: updatedSupplier.businessType || 'Manufacturer',
        status: updatedSupplier.status || 'Active',
        leadTime: updatedSupplier.leadTime || 0,
        paymentTerms: updatedSupplier.paymentTerms || '',
        taxId: updatedSupplier.taxId,
        streetAddress: updatedSupplier.streetAddress,
        city: updatedSupplier.city,
        state: updatedSupplier.state,
        postalCode: updatedSupplier.postalCode,
        country: updatedSupplier.country,
      }
      setSuppliers([...suppliers, newSupplier])
    }
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden" data-testid="suppliers-table">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 border-neutral-200 border-b">
                <TableHead className="font-medium text-neutral-600">Supplier ID</TableHead>
                <TableHead className="font-medium text-neutral-600">Name</TableHead>
                <TableHead className="font-medium text-neutral-600">Contact Person</TableHead>
                <TableHead className="font-medium text-neutral-600">Email</TableHead>
                <TableHead className="font-medium text-neutral-600">Phone</TableHead>
                <TableHead className="font-medium text-neutral-600">Business Type</TableHead>
                <TableHead className="font-medium text-neutral-600">Status</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="border-neutral-200 border-b">
                  <TableCell className="font-medium text-neutral-700">{supplier.id}</TableCell>
                  <TableCell className="text-neutral-700">{supplier.name}</TableCell>
                  <TableCell className="text-neutral-700">{supplier.contactPerson}</TableCell>
                  <TableCell className="text-neutral-700">{supplier.email}</TableCell>
                  <TableCell className="text-neutral-700">{supplier.phone}</TableCell>
                  <TableCell className="text-neutral-600">{supplier.businessType}</TableCell>
                  <TableCell>
                    <StatusBadge status={supplier.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-primary" onClick={() => handleEditSupplier(supplier)}>
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
          <p className="text-neutral-600 text-sm">Showing 1 to 3 of 3 suppliers</p>
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
        <button className="hidden" data-action="add-supplier" onClick={handleAddSupplier} />
      </div>

      <SupplierDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} supplier={selectedSupplier} onSave={handleSaveSupplier} />
    </>
  )
}

function StatusBadge({ status }: { status: Supplier['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'Active' && 'bg-success-light text-success-dark',
        status === 'Inactive' && 'bg-danger-light text-danger-dark',
        status === 'On Hold' && 'bg-warning-light text-warning-dark'
      )}
    >
      {status}
    </span>
  )
}
