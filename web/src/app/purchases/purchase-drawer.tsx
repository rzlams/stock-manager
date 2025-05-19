'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { FileText, PlusCircle, Trash2, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Purchase, PurchaseBase, PurchaseBill, PurchaseLineItem } from './types'

interface PurchaseDrawerProps {
  isOpen: boolean
  onClose: () => void
  purchase?: Purchase | null
  onSave: (purchase: Partial<Purchase>) => void
  type: 'order' | 'bill'
}

export function PurchaseDrawer({ isOpen, onClose, purchase, onSave, type }: PurchaseDrawerProps) {
  const [formData, setFormData] = useState<Partial<Purchase>>({
    type,
    number: '',
    supplierId: '',
    supplierReference: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    expectedDeliveryDate: '',
    notes: '',
    lineItems: [],
    totalAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
    ...(type === 'bill' && {
      billNumber: '',
      paymentTerms: 'net30',
      paymentStatus: 'unpaid',
      paidAmount: 0,
      dueDate: '',
      pdfFile: '',
    }),
    ...(type === 'order' && {
      deliveredItems: 0,
    }),
  })
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [pdfPreview, setPdfPreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (purchase) {
      setFormData(purchase)
    } else {
      setFormData({
        type,
        number: '',
        supplierId: '',
        supplierReference: '',
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        expectedDeliveryDate: '',
        notes: '',
        lineItems: [],
        totalAmount: 0,
        taxAmount: 0,
        grandTotal: 0,
        ...(type === 'bill' && {
          billNumber: '',
          paymentTerms: 'net30',
          paymentStatus: 'unpaid',
          paidAmount: 0,
          dueDate: '',
          pdfFile: '',
        }),
        ...(type === 'order' && {
          deliveredItems: 0,
        }),
      })
    }
  }, [purchase, isOpen, type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: include selectedPdf in the submit data
    console.log(selectedPdf)
    onSave({ ...formData, type })
    onClose()
  }

  const handlePdfChange = useCallback((file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file')
      return
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedPdf(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPdfPreview(base64String)
      setFormData((prev) => ({ ...prev, pdfFile: base64String }))
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handlePdfChange(file)
      }
    },
    [handlePdfChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handlePdfChange(file)
      }
    },
    [handlePdfChange]
  )

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
            <h2 className="font-semibold text-neutral-700 text-xl">
              {purchase
                ? `Edit ${type === 'order' ? 'Purchase Order' : 'Purchase Bill'}`
                : `Add New ${type === 'order' ? 'Purchase Order' : 'Purchase Bill'}`}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 text-neutral-500">
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {type === 'bill' && (
                  <div>
                    <h3 className="mb-4 font-medium text-neutral-700 text-lg">Bill Information</h3>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="billNumber" className="font-medium text-neutral-700 text-sm">
                          Bill Number <span className="text-danger">*</span>
                        </label>
                        <Input
                          id="billNumber"
                          name="billNumber"
                          value={(formData as PurchaseBill).billNumber}
                          onChange={handleChange}
                          placeholder="Enter bill number"
                          className="border-neutral-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="paymentTerms" className="font-medium text-neutral-700 text-sm">
                          Payment Terms <span className="text-danger">*</span>
                        </label>
                        <Select
                          value={(formData as PurchaseBill).paymentTerms}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentTerms: value as PurchaseBill['paymentTerms'],
                            }))
                          }
                        >
                          <SelectTrigger className="border-neutral-300">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="net15">Net 15</SelectItem>
                            <SelectItem value="net30">Net 30</SelectItem>
                            <SelectItem value="net45">Net 45</SelectItem>
                            <SelectItem value="net60">Net 60</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                      <div className="space-y-2">
                        <label htmlFor="paidAmount" className="font-medium text-neutral-700 text-sm">
                          Paid Amount
                        </label>
                        <div className="relative">
                          <span className="top-1/2 left-3 absolute text-neutral-500 -translate-y-1/2">$</span>
                          <Input
                            id="paidAmount"
                            name="paidAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={(formData as PurchaseBill).paidAmount}
                            onChange={handleChange}
                            className="pl-7 border-neutral-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="dueDate" className="font-medium text-neutral-700 text-sm">
                          Due Date <span className="text-danger">*</span>
                        </label>
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          value={(formData as PurchaseBill).dueDate}
                          onChange={handleChange}
                          className="border-neutral-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label htmlFor="pdfUpload" className="font-medium text-neutral-700 text-sm">
                        Bill PDF
                      </label>
                      <input type="file" id="pdfUpload" accept="application/pdf" onChange={handleFileInput} className="hidden" />
                      <div
                        className={cn(
                          'flex flex-col justify-center items-center bg-neutral-50 p-4 border border-neutral-300 border-dashed rounded-md h-32 text-center cursor-pointer transition-colors',
                          isDragging ? 'border-primary bg-primary/5' : 'hover:bg-neutral-100'
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('pdfUpload')?.click()}
                      >
                        {pdfPreview ? (
                          <div className="relative flex flex-col justify-center items-center w-full h-full">
                            <FileText className="mb-2 w-12 h-12 text-primary" />
                            <p className="font-medium text-primary text-sm">PDF File Uploaded</p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (pdfPreview) {
                                    const pdfWindow = window.open('', '_blank')
                                    if (pdfWindow) {
                                      pdfWindow.document.write(`
                                        <html>
                                          <head>
                                            <title>PDF Viewer</title>
                                            <style>
                                              body, html { margin: 0; padding: 0; height: 100%; }
                                              embed { width: 100%; height: 100%; }
                                            </style>
                                          </head>
                                          <body>
                                            <embed src="${pdfPreview}" type="application/pdf" />
                                          </body>
                                        </html>
                                      `)
                                      pdfWindow.document.close()
                                    }
                                  }
                                }}
                                className="text-xs"
                              >
                                View PDF
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedPdf(null)
                                  setPdfPreview('')
                                  setFormData((prev) => ({ ...prev, pdfFile: '' }))
                                }}
                                className="text-danger text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="mb-2 w-8 h-8 text-neutral-400" />
                            <p className="text-primary text-sm">Upload a PDF file</p>
                            <p className="text-neutral-500 text-xs">
                              or drag and drop
                              <br />
                              PDF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Basic Information</h3>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="number" className="font-medium text-neutral-700 text-sm">
                        {type === 'order' ? 'PO Number' : 'Reference Number'} <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder={`Enter ${type === 'order' ? 'PO' : 'reference'} number`}
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="supplierReference" className="font-medium text-neutral-700 text-sm">
                        Supplier Reference
                      </label>
                      <Input
                        id="supplierReference"
                        name="supplierReference"
                        value={formData.supplierReference}
                        onChange={handleChange}
                        placeholder="Enter supplier reference"
                        className="border-neutral-300"
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="date" className="font-medium text-neutral-700 text-sm">
                        Date <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="border-neutral-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="expectedDeliveryDate" className="font-medium text-neutral-700 text-sm">
                        Expected Delivery Date <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="expectedDeliveryDate"
                        name="expectedDeliveryDate"
                        type="date"
                        value={formData.expectedDeliveryDate}
                        onChange={handleChange}
                        className="border-neutral-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label htmlFor="status" className="font-medium text-neutral-700 text-sm">
                      Status <span className="text-danger">*</span>
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value as PurchaseBase['status'],
                        }))
                      }
                    >
                      <SelectTrigger className="border-neutral-300">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label htmlFor="notes" className="font-medium text-neutral-700 text-sm">
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      placeholder="Enter notes"
                      className="border-neutral-300 min-h-[100px]"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium text-neutral-700 text-lg">Line Items</h3>
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-neutral-100 border-neutral-200 border-b">
                            <TableHead className="font-medium text-neutral-600">Product</TableHead>
                            <TableHead className="font-medium text-neutral-600 text-right">Quantity</TableHead>
                            <TableHead className="font-medium text-neutral-600 text-right">Unit Price</TableHead>
                            <TableHead className="font-medium text-neutral-600 text-right">Total</TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.lineItems?.map((item, index) => (
                            <TableRow key={item.id} className="border-neutral-200 border-b">
                              <TableCell>
                                <Input
                                  value={item.productName}
                                  onChange={(e) => {
                                    const newItems = [...(formData.lineItems || [])]
                                    newItems[index] = { ...item, productName: e.target.value }
                                    setFormData((prev) => ({ ...prev, lineItems: newItems }))
                                  }}
                                  placeholder="Enter product name"
                                  className="border-neutral-300"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newItems = [...(formData.lineItems || [])]
                                      const quantity = parseInt(e.target.value) || 0
                                      newItems[index] = {
                                        ...item,
                                        quantity,
                                        total: quantity * item.unitPrice,
                                      }
                                      setFormData((prev) => ({ ...prev, lineItems: newItems }))
                                    }}
                                    className="border-neutral-300 w-24 text-right"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <div className="relative">
                                    <span className="top-1/2 left-3 absolute text-neutral-500 -translate-y-1/2">$</span>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.unitPrice}
                                      onChange={(e) => {
                                        const newItems = [...(formData.lineItems || [])]
                                        const unitPrice = parseFloat(e.target.value) || 0
                                        newItems[index] = {
                                          ...item,
                                          unitPrice,
                                          total: item.quantity * unitPrice,
                                        }
                                        setFormData((prev) => ({ ...prev, lineItems: newItems }))
                                      }}
                                      className="pl-7 border-neutral-300 w-32 text-right"
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-neutral-700 text-right">${item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 text-danger"
                                  onClick={() => {
                                    const newItems = formData.lineItems?.filter((_, i) => i !== index) || []
                                    setFormData((prev) => ({ ...prev, lineItems: newItems }))
                                  }}
                                >
                                  <Trash2 size={18} />
                                  <span className="sr-only">Remove item</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="border-neutral-300 w-full"
                      onClick={() => {
                        const newItem: PurchaseLineItem = {
                          id: `LI${Date.now()}`,
                          productId: '',
                          productName: '',
                          quantity: 1,
                          unitPrice: 0,
                          total: 0,
                        }
                        setFormData((prev) => ({
                          ...prev,
                          lineItems: [...(prev.lineItems || []), newItem],
                        }))
                      }}
                    >
                      <PlusCircle size={18} className="mr-2" />
                      Add Line Item
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-neutral-200 border-t">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-contrast">
                    {purchase ? 'Save Changes' : 'Create Purchase'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
