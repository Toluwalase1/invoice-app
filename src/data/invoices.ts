import type { Invoice, InvoiceFormData } from '../types/invoice.ts'

/**
 * Seed data is an empty array — no sample invoices.
 * The app starts with the empty state on first visit.
 */
export const initialInvoices: Invoice[] = []

/**
 * Returns a fresh, empty form data object for creating a new invoice.
 * Using a factory avoids shared-reference mutations between form opens.
 */
export function blankFormData(): InvoiceFormData {
  return {
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientName: '',
    clientEmail: '',
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    issueDate: new Date().toISOString().slice(0, 10),
    paymentTerms: 'Net 30 Days',
    description: '',
    items: [],
  }
}

export const paymentOptions = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days']
