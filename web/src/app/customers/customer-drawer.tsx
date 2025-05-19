'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

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

interface CustomerDrawerProps {
  isOpen: boolean
  onClose: () => void
  customer?: Customer | null
  onSave: (customer: Partial<Customer>) => void
}

export function CustomerDrawer({ isOpen, onClose, customer, onSave }: CustomerDrawerProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'Individual',
    status: 'Active',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    notes: '',
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        address: customer.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        type: 'Individual',
        status: 'Active',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
        notes: '',
      })
    }
  }, [customer, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1] as keyof Customer['address']
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address!,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div className={cn('fixed inset-0 z-40 bg-black/50 transition-opacity', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')} />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-white shadow-lg transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-neutral-200 border-b">
            <h2 className="font-semibold text-neutral-700 text-xl">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-neutral-500">
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Basic Information</h3>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="font-medium text-neutral-700 text-sm">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="customerId" className="font-medium text-neutral-700 text-sm">
                        Customer ID
                      </label>
                      <Input
                        id="customerId"
                        name="id"
                        value={customer?.id || 'Generated automatically'}
                        className="bg-neutral-100 border-neutral-300 text-neutral-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="font-medium text-neutral-700 text-sm">
                        Email <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="font-medium text-neutral-700 text-sm">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="border-neutral-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="type" className="font-medium text-neutral-700 text-sm">
                        Customer Type <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as 'Individual' | 'Business' }))}
                      >
                        <SelectTrigger className="border-neutral-300">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="font-medium text-neutral-700 text-sm">
                        Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as 'Active' | 'Inactive' }))}
                      >
                        <SelectTrigger className="border-neutral-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.type === 'Business' && (
                    <div className="space-y-2 mt-4">
                      <label htmlFor="company" className="font-medium text-neutral-700 text-sm">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        className="border-neutral-300"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Address Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="street" className="font-medium text-neutral-700 text-sm">
                        Street Address
                      </label>
                      <Input
                        id="street"
                        name="address.street"
                        value={formData.address?.street}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        className="border-neutral-300"
                      />
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="city" className="font-medium text-neutral-700 text-sm">
                          City
                        </label>
                        <Input
                          id="city"
                          name="address.city"
                          value={formData.address?.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                          className="border-neutral-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="font-medium text-neutral-700 text-sm">
                          State/Province
                        </label>
                        <Input
                          id="state"
                          name="address.state"
                          value={formData.address?.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                          className="border-neutral-300"
                        />
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="country" className="font-medium text-neutral-700 text-sm">
                          Country
                        </label>
                        <Input
                          id="country"
                          name="address.country"
                          value={formData.address?.country}
                          onChange={handleChange}
                          placeholder="Enter country"
                          className="border-neutral-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="font-medium text-neutral-700 text-sm">
                          ZIP/Postal Code
                        </label>
                        <Input
                          id="zipCode"
                          name="address.zipCode"
                          value={formData.address?.zipCode}
                          onChange={handleChange}
                          placeholder="Enter ZIP code"
                          className="border-neutral-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Additional Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="font-medium text-neutral-700 text-sm">
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      placeholder="Enter any additional notes"
                      className="border-neutral-300 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onClose} className="border-neutral-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-contrast">
                  {customer ? 'Save Changes' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
