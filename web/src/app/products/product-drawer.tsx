'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  category: string
  stock: number
  price: number
  status: 'In Stock' | 'Out of Stock' | 'Low Stock'
  description?: string
  cost?: number
  lowStockThreshold?: number
  sku?: string
  barcode?: string
  vendor?: string
}

interface ProductDrawerProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  onSave: (product: Partial<Product>) => void
}

export function ProductDrawer({ isOpen, onClose, product, onSave }: ProductDrawerProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    status: 'In Stock',
    lowStockThreshold: 10,
    sku: '',
    barcode: '',
    vendor: '',
  })

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        cost: product.cost || 0,
        lowStockThreshold: product.lowStockThreshold || 10,
      })
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: 0,
        cost: 0,
        stock: 0,
        status: 'In Stock',
        lowStockThreshold: 10,
        sku: '',
        barcode: '',
        vendor: '',
      })
    }
  }, [product, isOpen])

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
            <h2 className="font-semibold text-neutral-700 text-xl">{product ? 'Edit Product' : 'Add New Product'}</h2>
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
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="productId" className="font-medium text-neutral-700 text-sm">
                        Product ID
                      </label>
                      <Input
                        id="productId"
                        name="id"
                        value={product?.id || 'Generated automatically'}
                        className="bg-neutral-100 border-neutral-300 text-neutral-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label htmlFor="category" className="font-medium text-neutral-700 text-sm">
                      Category <span className="text-danger">*</span>
                    </label>
                    <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                      <SelectTrigger className="border-neutral-300">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Home Decor">Home Decor</SelectItem>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label htmlFor="description" className="font-medium text-neutral-700 text-sm">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      className="border-neutral-300 min-h-[100px]"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Inventory & Pricing</h3>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="price" className="font-medium text-neutral-700 text-sm">
                        Price <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <span className="top-1/2 left-3 absolute text-neutral-500 -translate-y-1/2">$</span>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="pl-7 border-neutral-300"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cost" className="font-medium text-neutral-700 text-sm">
                        Cost
                      </label>
                      <div className="relative">
                        <span className="top-1/2 left-3 absolute text-neutral-500 -translate-y-1/2">$</span>
                        <Input
                          id="cost"
                          name="cost"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.cost}
                          onChange={handleChange}
                          className="pl-7 border-neutral-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="stock" className="font-medium text-neutral-700 text-sm">
                        Stock Quantity <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="font-medium text-neutral-700 text-sm">
                        Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: value as 'In Stock' | 'Out of Stock' | 'Low Stock',
                          }))
                        }
                      >
                        <SelectTrigger className="border-neutral-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Stock">Active</SelectItem>
                          <SelectItem value="Out of Stock">Inactive</SelectItem>
                          <SelectItem value="Low Stock">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label htmlFor="lowStockThreshold" className="font-medium text-neutral-700 text-sm">
                      Low Stock Threshold
                    </label>
                    <Input
                      id="lowStockThreshold"
                      name="lowStockThreshold"
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={handleChange}
                      className="border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Additional Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="sku" className="font-medium text-neutral-700 text-sm">
                        SKU
                      </label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku || ''}
                        onChange={handleChange}
                        placeholder="Enter SKU"
                        className="border-neutral-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="barcode" className="font-medium text-neutral-700 text-sm">
                        Barcode
                      </label>
                      <Input
                        id="barcode"
                        name="barcode"
                        value={formData.barcode || ''}
                        onChange={handleChange}
                        placeholder="Enter barcode"
                        className="border-neutral-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="vendor" className="font-medium text-neutral-700 text-sm">
                        Vendor
                      </label>
                      <Select value={formData.vendor || ''} onValueChange={(value) => setFormData((prev) => ({ ...prev, vendor: value }))}>
                        <SelectTrigger className="border-neutral-300">
                          <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Acme Supplies">Acme Supplies</SelectItem>
                          <SelectItem value="Tech Distributors">Tech Distributors</SelectItem>
                          <SelectItem value="Home Goods Inc.">Home Goods Inc.</SelectItem>
                          <SelectItem value="Kitchen Essentials">Kitchen Essentials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="imageUpload" className="font-medium text-neutral-700 text-sm">
                        Image Upload
                      </label>
                      <div className="flex flex-col justify-center items-center bg-neutral-50 p-4 border border-neutral-300 border-dashed rounded-md h-32 text-center cursor-pointer">
                        <Upload className="mb-2 w-8 h-8 text-neutral-400" />
                        <p className="text-primary text-sm">Upload a file</p>
                        <p className="text-neutral-500 text-xs">
                          or drag and drop
                          <br />
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-3 bg-neutral-50 p-4 border-neutral-200 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="border-neutral-300 text-neutral-700">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary-hover text-primary-contrast">
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
