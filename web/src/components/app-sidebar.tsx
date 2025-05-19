'use client'

import { useSidebar } from '@/components/sidebar-provider'
import { cn } from '@/lib/utils'
import { BarChart, LayoutDashboard, LineChart, Package, Settings, ShoppingCart, Users } from 'lucide-react'
import { NavItem } from './nav-item'

export function AppSidebar() {
  const { isOpen } = useSidebar()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-neutral-800 to-neutral-900 transition-all duration-300',
        isOpen ? 'w-[260px]' : 'w-[70px]'
      )}
    >
      <div className="flex items-center px-6 h-[60px]">
        <h1 className={cn('text-neutral-50 font-bold text-xl transition-opacity', isOpen ? 'opacity-100' : 'opacity-0')}>ACME ERP</h1>
      </div>

      <div className="mt-6 px-3">
        <div className="mb-6">
          <p className={cn('px-3 mb-2 text-neutral-400 text-xs font-medium uppercase tracking-wider', isOpen ? 'block' : 'hidden')}>Main</p>
          <nav className="space-y-1">
            <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isOpen} />
            <NavItem href="/products" icon={<Package size={20} />} label="Products" isOpen={isOpen} active />
            <NavItem href="/customers" icon={<Users size={20} />} label="Customers" isOpen={isOpen} />
            <NavItem href="/orders" icon={<ShoppingCart size={20} />} label="Orders" isOpen={isOpen} />
          </nav>
        </div>

        <div className="mb-6">
          <p className={cn('px-3 mb-2 text-neutral-400 text-xs font-medium uppercase tracking-wider', isOpen ? 'block' : 'hidden')}>Reports</p>
          <nav className="space-y-1">
            <NavItem href="/sales" icon={<BarChart size={20} />} label="Sales" isOpen={isOpen} />
            <NavItem href="/inventory" icon={<LineChart size={20} />} label="Inventory" isOpen={isOpen} />
          </nav>
        </div>
      </div>

      <div className="bottom-8 absolute px-3 w-full">
        <nav className="space-y-1">
          <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
        </nav>
      </div>
    </aside>
  )
}
