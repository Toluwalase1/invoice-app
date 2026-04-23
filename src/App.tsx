import { useMemo, useState } from 'react'
import { InvoiceFormDrawer } from './components/forms/InvoiceFormDrawer.tsx'
import { DeleteModal } from './components/modals/DeleteModal.tsx'
import { InvoiceDetails } from './components/invoices/InvoiceDetails.tsx'
import { EmptyState } from './components/invoices/EmptyState.tsx'
import { InvoiceHeader } from './components/invoices/InvoiceHeader.tsx'
import { InvoiceList } from './components/invoices/InvoiceList.tsx'
import { SideNav } from './components/layout/SideNav.tsx'
import { paymentOptions } from './data/invoices.ts'
import { useTheme } from './hooks/useTheme.ts'
import { useInvoices } from './hooks/useInvoices.ts'
import { useInvoiceForm } from './hooks/useInvoiceForm.ts'
import type { Filters, InvoiceStatus, ViewMode } from './types/invoice.ts'
import './App.css'

function App() {
  // —— Core hooks (persistence-aware) ——
  const { theme, toggleTheme } = useTheme()
  const { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoices()
  const form = useInvoiceForm()

  // —— UI-only state (no persistence needed) ——
  const [view, setView] = useState<ViewMode>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<Filters>({ draft: false, pending: false, paid: false })
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const selectedInvoice = useMemo(
    () => invoices.find((invoice) => invoice.id === selectedId) ?? null,
    [invoices, selectedId],
  )

  const visibleInvoices = useMemo(() => {
    const selectedStatuses = Object.entries(filters)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key as InvoiceStatus)

    if (selectedStatuses.length === 0) return invoices
    return invoices.filter((invoice) => selectedStatuses.includes(invoice.status))
  }, [filters, invoices])

  const invoiceSummaryText = useMemo(() => {
    if (visibleInvoices.length === 0) return 'No invoices'

    const selectedStatuses = Object.entries(filters)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key)

    if (selectedStatuses.length === 1) {
      return `There are ${visibleInvoices.length} ${selectedStatuses[0]} invoices`
    }

    return `There are ${visibleInvoices.length} total invoices`
  }, [filters, visibleInvoices.length])

  // —— Handlers ——
  function handleOpenEdit() {
    if (!selectedInvoice) return
    form.openEdit(selectedInvoice)
  }

  function handleSave(status: InvoiceStatus) {
    const isDraft = status === 'draft'
    if (!form.validate(isDraft)) return

    if (form.formMode === 'create') {
      const newInvoice = addInvoice(form.formData, status)
      setSelectedId(newInvoice.id)
      setView('details')
    } else if (selectedInvoice) {
      updateInvoice(selectedInvoice.id, form.formData, status)
    }

    form.close()
  }

  function handleDelete() {
    if (!selectedInvoice) return

    const nextInvoice = invoices.find((inv) => inv.id !== selectedInvoice.id)
    deleteInvoice(selectedInvoice.id)

    if (nextInvoice) {
      setSelectedId(nextInvoice.id)
    } else {
      setSelectedId(null)
    }

    setView('list')
    setIsDeleteOpen(false)
  }

  function handleMarkAsPaid() {
    if (!selectedInvoice) return
    markAsPaid(selectedInvoice.id)
  }

  return (
    <div className={`app ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <SideNav theme={theme} onToggleTheme={toggleTheme} />

      <main className="content">
        {view === 'list' ? (
          <section className="list-view">
            <InvoiceHeader
              summaryText={invoiceSummaryText}
              showFilter={showFilter}
              filters={filters}
              onToggleFilter={() => setShowFilter((open) => !open)}
              onToggleStatus={(status) =>
                setFilters((current) => ({ ...current, [status]: !current[status] }))
              }
              onCreate={form.openCreate}
            />

            {visibleInvoices.length === 0 ? (
              <EmptyState />
            ) : (
              <InvoiceList
                invoices={visibleInvoices}
                onOpenDetails={(id) => {
                  setSelectedId(id)
                  setView('details')
                }}
              />
            )}
          </section>
        ) : selectedInvoice ? (
          <InvoiceDetails
            invoice={selectedInvoice}
            onBack={() => setView('list')}
            onEdit={handleOpenEdit}
            onDelete={() => setIsDeleteOpen(true)}
            onMarkAsPaid={handleMarkAsPaid}
          />
        ) : null}
      </main>

      <InvoiceFormDrawer
        isOpen={form.isOpen}
        formMode={form.formMode}
        selectedInvoice={selectedInvoice}
        formData={form.formData}
        setFormData={form.setFormData}
        errors={form.errors}
        submitted={form.submitted}
        paymentOptions={paymentOptions}
        onClose={form.close}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={isDeleteOpen && !!selectedInvoice}
        invoiceId={selectedInvoice?.id ?? ''}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default App
