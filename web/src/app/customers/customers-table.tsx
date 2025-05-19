'use client'

import { CustomerDrawer } from '@/app/customers/customer-drawer'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  type: 'Individual' | 'Business'
  status: 'Active' | 'Inactive'
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  address?: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  notes?: string
}

const initialCustomers: Customer[] = [
  {
    id: '#CUS001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'Individual',
    status: 'Active',
    totalOrders: 12,
    totalSpent: 2499.99,
    lastOrderDate: '2024-03-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
    },
  },
  {
    id: '#CUS002',
    name: 'Acme Corporation',
    email: 'orders@acme.com',
    phone: '+1 (555) 987-6543',
    company: 'Acme Corp',
    type: 'Business',
    status: 'Active',
    totalOrders: 45,
    totalSpent: 12500.5,
    lastOrderDate: '2024-03-10',
    address: {
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90001',
    },
  },
  {
    id: '#CUS003',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 456-7890',
    type: 'Individual',
    status: 'Inactive',
    totalOrders: 3,
    totalSpent: 299.99,
    lastOrderDate: '2023-12-20',
    address: {
      street: '789 Oak St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      zipCode: '60601',
    },
  },
]

export function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDrawerOpen(true)
  }

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setIsDrawerOpen(true)
  }

  const handleSaveCustomer = (updatedCustomer: Partial<Customer>) => {
    if (selectedCustomer) {
      // Update existing customer
      setCustomers(customers.map((c) => (c.id === selectedCustomer.id ? { ...c, ...updatedCustomer } : c)))
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: `#CUS${String(customers.length + 1).padStart(3, '0')}`,
        name: updatedCustomer.name || '',
        email: updatedCustomer.email || '',
        phone: updatedCustomer.phone || '',
        type: updatedCustomer.type || 'Individual',
        status: updatedCustomer.status || 'Active',
        totalOrders: 0,
        totalSpent: 0,
        company: updatedCustomer.company,
        address: updatedCustomer.address,
        notes: updatedCustomer.notes,
      }
      setCustomers([...customers, newCustomer])
    }
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden" data-testid="customers-table">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 border-neutral-200 border-b">
                <TableHead className="font-medium text-neutral-600">Customer ID</TableHead>
                <TableHead className="font-medium text-neutral-600">Name</TableHead>
                <TableHead className="font-medium text-neutral-600">Email</TableHead>
                <TableHead className="font-medium text-neutral-600">Phone</TableHead>
                <TableHead className="font-medium text-neutral-600">Type</TableHead>
                <TableHead className="font-medium text-neutral-600">Status</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Total Orders</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="border-neutral-200 border-b">
                  <TableCell className="font-medium text-neutral-700">{customer.id}</TableCell>
                  <TableCell className="text-neutral-700">{customer.name}</TableCell>
                  <TableCell className="text-neutral-600">{customer.email}</TableCell>
                  <TableCell className="text-neutral-600">{customer.phone}</TableCell>
                  <TableCell className="text-neutral-600">{customer.type}</TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status} />
                  </TableCell>
                  <TableCell className="text-neutral-700 text-right">{customer.totalOrders}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-primary" onClick={() => handleEditCustomer(customer)}>
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
          <p className="text-neutral-600 text-sm">Showing 1 to 3 of 3 customers</p>
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
        <button className="hidden" data-action="add-customer" onClick={handleAddCustomer} />
      </div>

      <CustomerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} customer={selectedCustomer} onSave={handleSaveCustomer} />
    </>
  )
}

function StatusBadge({ status }: { status: Customer['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'Active' && 'bg-success-light text-success-dark',
        status === 'Inactive' && 'bg-danger-light text-danger-dark'
      )}
    >
      {status}
    </span>
  )
}
