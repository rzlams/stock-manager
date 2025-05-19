'use client'

import { ProductDrawer } from '@/app/products/product-drawer'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

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

const initialProducts: Product[] = [
  {
    id: '#PRD001',
    name: 'Modern Desk Lamp',
    category: 'Home Decor',
    stock: 124,
    price: 59.99,
    status: 'In Stock',
    description: 'A sleek modern desk lamp with adjustable brightness.',
    cost: 35.5,
    lowStockThreshold: 20,
    sku: 'LAMP-001',
    barcode: '8901234567890',
    vendor: 'Home Goods Inc.',
  },
  {
    id: '#PRD002',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    stock: 57,
    price: 129.99,
    status: 'In Stock',
    description: 'Premium wireless earbuds with noise cancellation.',
    cost: 75.25,
    lowStockThreshold: 15,
    sku: 'EARBUD-002',
    barcode: '7890123456789',
    vendor: 'Tech Distributors',
  },
  {
    id: '#PRD003',
    name: 'Coffee Maker',
    category: 'Kitchen',
    stock: 0,
    price: 89.99,
    status: 'Out of Stock',
    description: 'Programmable coffee maker with thermal carafe.',
    cost: 45.0,
    lowStockThreshold: 10,
    sku: 'COFFEE-003',
    barcode: '6789012345678',
    vendor: 'Kitchen Essentials',
  },
  {
    id: '#PRD004',
    name: 'Office Chair',
    category: 'Furniture',
    stock: 18,
    price: 249.99,
    status: 'Low Stock',
    description: 'Ergonomic office chair with lumbar support.',
    cost: 150.0,
    lowStockThreshold: 20,
    sku: 'CHAIR-004',
    barcode: '5678901234567',
    vendor: 'Acme Supplies',
  },
  {
    id: '#PRD005',
    name: 'Smart Watch',
    category: 'Electronics',
    stock: 42,
    price: 199.99,
    status: 'In Stock',
    description: 'Smart watch with health monitoring features.',
    cost: 120.5,
    lowStockThreshold: 15,
    sku: 'WATCH-005',
    barcode: '4567890123456',
    vendor: 'Tech Distributors',
  },
]

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsDrawerOpen(true)
  }

  const handleSaveProduct = (updatedProduct: Partial<Product>) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...p, ...updatedProduct } : p)))
    } else {
      // Add new product
      const newProduct: Product = {
        id: `#PRD${String(products.length + 1).padStart(3, '0')}`,
        name: updatedProduct.name || '',
        category: updatedProduct.category || '',
        stock: updatedProduct.stock || 0,
        price: updatedProduct.price || 0,
        status: (updatedProduct.status as 'In Stock' | 'Out of Stock' | 'Low Stock') || 'In Stock',
        description: updatedProduct.description,
        cost: updatedProduct.cost,
        lowStockThreshold: updatedProduct.lowStockThreshold,
        sku: updatedProduct.sku,
        barcode: updatedProduct.barcode,
        vendor: updatedProduct.vendor,
      }
      setProducts([...products, newProduct])
    }
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden" data-testid="products-table">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 border-neutral-200 border-b">
                <TableHead className="font-medium text-neutral-600">Product ID</TableHead>
                <TableHead className="font-medium text-neutral-600">Name</TableHead>
                <TableHead className="font-medium text-neutral-600">Category</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Stock</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Price</TableHead>
                <TableHead className="font-medium text-neutral-600">Status</TableHead>
                <TableHead className="font-medium text-neutral-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-neutral-200 border-b">
                  <TableCell className="font-medium text-neutral-700">{product.id}</TableCell>
                  <TableCell className="text-neutral-700">{product.name}</TableCell>
                  <TableCell className="text-neutral-600">{product.category}</TableCell>
                  <TableCell className="text-neutral-700 text-right">{product.stock}</TableCell>
                  <TableCell className="text-neutral-700 text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={product.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-primary" onClick={() => handleEditProduct(product)}>
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
          <p className="text-neutral-600 text-sm">Showing 1 to 5 of 24 products</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="border-neutral-300 text-sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary-light border-primary-light text-primary text-sm">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-300 text-sm">
              2
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-300 text-sm">
              3
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-300 text-sm">
              Next
            </Button>
          </div>
        </div>
        {/* Hidden button for external triggering */}
        <button className="hidden" data-action="add-product" onClick={handleAddProduct} />
      </div>

      <ProductDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} product={selectedProduct} onSave={handleSaveProduct} />
    </>
  )
}

function StatusBadge({ status }: { status: Product['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'In Stock' && 'bg-success-light text-success-dark',
        status === 'Out of Stock' && 'bg-danger-light text-danger-dark',
        status === 'Low Stock' && 'bg-warning-light text-warning-dark'
      )}
    >
      {status}
    </span>
  )
}
