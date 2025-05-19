'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

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

interface SupplierDrawerProps {
  isOpen: boolean
  onClose: () => void
  supplier?: Supplier | null
  onSave: (supplier: Partial<Supplier>) => void
}

export function SupplierDrawer({ isOpen, onClose, supplier, onSave }: SupplierDrawerProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    businessType: 'Manufacturer',
    status: 'Active',
    leadTime: 0,
    paymentTerms: '',
    taxId: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })

  useEffect(() => {
    if (supplier) {
      setFormData(supplier)
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        businessType: 'Manufacturer',
        status: 'Active',
        leadTime: 0,
        paymentTerms: '',
        taxId: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      })
    }
  }, [supplier, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
            <h2 className="font-semibold text-neutral-700 text-xl">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
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
                        Supplier Name <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter supplier name"
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="supplierId" className="font-medium text-neutral-700 text-sm">
                        Supplier ID
                      </label>
                      <Input
                        id="supplierId"
                        name="id"
                        value={supplier?.id || 'Generated automatically'}
                        className="bg-neutral-100 border-neutral-300 text-neutral-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="contactPerson" className="font-medium text-neutral-700 text-sm">
                        Contact Person <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="Enter contact person name"
                        className="border-neutral-300"
                        required
                      />
                    </div>
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
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
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
                    <div className="space-y-2">
                      <label htmlFor="website" className="font-medium text-neutral-700 text-sm">
                        Website
                      </label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                        className="border-neutral-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Business Information</h3>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="businessType" className="font-medium text-neutral-700 text-sm">
                        Business Type <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value as Supplier['businessType'] }))}
                      >
                        <SelectTrigger className="border-neutral-300">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="Distributor">Distributor</SelectItem>
                          <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="font-medium text-neutral-700 text-sm">
                        Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Supplier['status'] }))}
                      >
                        <SelectTrigger className="border-neutral-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="leadTime" className="font-medium text-neutral-700 text-sm">
                        Lead Time (days) <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="leadTime"
                        name="leadTime"
                        type="number"
                        min="0"
                        value={formData.leadTime}
                        onChange={handleChange}
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="paymentTerms" className="font-medium text-neutral-700 text-sm">
                        Payment Terms <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="paymentTerms"
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleChange}
                        placeholder="e.g., Net 30"
                        className="border-neutral-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label htmlFor="taxId" className="font-medium text-neutral-700 text-sm">
                      Tax ID / VAT Number
                    </label>
                    <Input
                      id="taxId"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="Enter tax ID or VAT number"
                      className="border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Address Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="streetAddress" className="font-medium text-neutral-700 text-sm">
                      Street Address
                    </label>
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      placeholder="Enter street address"
                      className="border-neutral-300"
                    />
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="font-medium text-neutral-700 text-sm">
                        City
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="border-neutral-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="state" className="font-medium text-neutral-700 text-sm">
                        State / Province
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state or province"
                        className="border-neutral-300"
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="postalCode" className="font-medium text-neutral-700 text-sm">
                        Postal Code
                      </label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                        className="border-neutral-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="font-medium text-neutral-700 text-sm">
                        Country
                      </label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter country"
                        className="border-neutral-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={onClose} className="border-neutral-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-contrast">
                  {supplier ? 'Save Changes' : 'Add Supplier'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
