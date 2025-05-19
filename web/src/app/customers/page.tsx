'use client'

import { CustomersTable } from '@/app/customers/customers-table'
import { useSidebar } from '@/components/sidebar-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Bell, Menu, PlusCircle, Search } from 'lucide-react'

export default function CustomersPage() {
  const { isOpen, toggle } = useSidebar()

  return (
    <div className={cn('flex-1 transition-all duration-300', isOpen ? 'ml-[260px]' : 'ml-[70px]')}>
      <header className="flex justify-between items-center bg-white px-6 borderneutral-200 border-b h-[60px]">
        <Button variant="ghost" size="icon" onClick={toggle} className="text-neutral-600">
          <Menu size={20} />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-neutral-600">
            <Bell size={20} />
            <span className="top-2 right-2 absolute bg-danger rounded-full w-2 h-2"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="flex justify-center items-center bg-primary rounded-full w-9 h-9 font-medium text-primary-contrast">JD</div>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-8">
          <h1 className="mb-1 font-semibold text-neutral-700 text-2xl">Customers</h1>
          <p className="text-neutral-500 text-base">Manage your customer database</p>
        </div>

        <div className="flex md:flex-row flex-col justify-between gap-4 mb-6">
          <div className="w-full md:w-[40%]">
            <Input placeholder="Search customers..." className="border-neutral-300 h-10" prefix={<Search className="w-4 h-4 text-neutral-400" />} />
          </div>
          <Button
            className="bg-primary hover:bg-primary-hover h-10 text-primary-contrast"
            onClick={() => {
              const customersTable = document.querySelector('[data-testid="customers-table"]')
              if (customersTable) {
                const addButton = customersTable.querySelector('[data-action="add-customer"]')
                if (addButton) {
                  ;(addButton as HTMLButtonElement).click()
                }
              }
            }}
          >
            <PlusCircle size={18} className="mr-2" />
            Add Customer
          </Button>
        </div>

        <CustomersTable />
      </main>
    </div>
  )
}
