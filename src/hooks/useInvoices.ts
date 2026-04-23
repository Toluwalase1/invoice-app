import { useCallback, useEffect, useState } from 'react'
import type { Invoice, InvoiceFormData, InvoiceStatus } from '../types/invoice.ts'
import { loadInvoices, saveInvoices } from '../lib/storage.ts'
import { initialInvoices } from '../data/invoices.ts'
import { generateId } from '../utils/invoice.ts'

/**
 * Owns the invoices state array, seeds from localStorage (or initial data on
 * first visit), and syncs every mutation back to localStorage.
 */
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = loadInvoices()
    return stored ?? initialInvoices
  })

  // Persist whenever the array changes.
  useEffect(() => {
    saveInvoices(invoices)
  }, [invoices])

  const addInvoice = useCallback(
    (formData: InvoiceFormData, status: InvoiceStatus): Invoice => {
      const newInvoice: Invoice = {
        id: generateId(),
        status,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        senderAddress: { ...formData.senderAddress },
        clientAddress: { ...formData.clientAddress },
        issueDate: formData.issueDate,
        paymentTerms: formData.paymentTerms,
        description: formData.description,
        items: formData.items.map((item) => ({ ...item })),
      }

      setInvoices((current) => [newInvoice, ...current])
      return newInvoice
    },
    [],
  )

  const updateInvoice = useCallback(
    (id: string, formData: InvoiceFormData, status: InvoiceStatus) => {
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === id
            ? {
                ...invoice,
                status,
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                senderAddress: { ...formData.senderAddress },
                clientAddress: { ...formData.clientAddress },
                issueDate: formData.issueDate,
                paymentTerms: formData.paymentTerms,
                description: formData.description,
                items: formData.items.map((item) => ({ ...item })),
              }
            : invoice,
        ),
      )
    },
    [],
  )

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((current) => current.filter((invoice) => invoice.id !== id))
  }, [])

  const markAsPaid = useCallback((id: string) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id ? { ...invoice, status: 'paid' as InvoiceStatus } : invoice,
      ),
    )
  }, [])

  return { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid } as const
}
