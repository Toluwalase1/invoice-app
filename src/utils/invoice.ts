import type { FormErrors, InvoiceFormData, InvoiceItem, InvoiceStatus } from '../types/invoice.ts'

export function formatCurrency(value: number) {
  return `£ ${value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function sumItems(items: InvoiceItem[]) {
  return items.reduce((total, item) => total + item.quantity * item.price, 0)
}

export function paymentDays(paymentTerms: string) {
  const map: Record<string, number> = {
    'Net 1 Day': 1,
    'Net 7 Days': 7,
    'Net 14 Days': 14,
    'Net 30 Days': 30,
  }

  return map[paymentTerms] ?? 30
}

export function dueDate(issueDate: string, paymentTerms: string) {
  const base = new Date(issueDate)
  base.setDate(base.getDate() + paymentDays(paymentTerms))
  return base.toISOString().slice(0, 10)
}

export function statusLabel(status: InvoiceStatus) {
  if (status === 'paid') return 'Paid'
  if (status === 'pending') return 'Pending'
  return 'Draft'
}

/**
 * Generate a 6-character alphanumeric invoice ID (e.g. "XM9141").
 * First two chars are uppercase letters, followed by four digits.
 */
export function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const l1 = letters[Math.floor(Math.random() * 26)]
  const l2 = letters[Math.floor(Math.random() * 26)]
  const digits = String(Math.floor(1000 + Math.random() * 9000))
  return `${l1}${l2}${digits}`
}

/**
 * Email regex — intentionally simple; catches obvious mistakes.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate invoice form data. Returns an object whose keys are field paths
 * and values are error messages. An empty object means the form is valid.
 */
export function validateInvoiceForm(data: InvoiceFormData): FormErrors {
  const errors: FormErrors = {}

  // Sender address
  if (!data.senderAddress.street.trim()) errors['senderStreet'] = 'Required'
  if (!data.senderAddress.city.trim()) errors['senderCity'] = 'Required'
  if (!data.senderAddress.postCode.trim()) errors['senderPostCode'] = 'Required'
  if (!data.senderAddress.country.trim()) errors['senderCountry'] = 'Required'

  // Client info
  if (!data.clientName.trim()) errors['clientName'] = "Can't be empty"
  if (!data.clientEmail.trim()) {
    errors['clientEmail'] = "Can't be empty"
  } else if (!EMAIL_RE.test(data.clientEmail.trim())) {
    errors['clientEmail'] = 'Invalid email'
  }

  // Client address
  if (!data.clientAddress.street.trim()) errors['clientStreet'] = 'Required'
  if (!data.clientAddress.city.trim()) errors['clientCity'] = 'Required'
  if (!data.clientAddress.postCode.trim()) errors['clientPostCode'] = 'Required'
  if (!data.clientAddress.country.trim()) errors['clientCountry'] = 'Required'

  // Date & description
  if (!data.issueDate) errors['issueDate'] = 'Required'
  if (!data.description.trim()) errors['description'] = "Can't be empty"

  // Items
  if (data.items.length === 0) {
    errors['items'] = 'An item must be added'
  } else {
    data.items.forEach((item, index) => {
      if (!item.name.trim()) errors[`items.${index}.name`] = 'Required'
      if (item.quantity < 1) errors[`items.${index}.quantity`] = 'Must be ≥ 1'
      if (item.price <= 0) errors[`items.${index}.price`] = 'Must be > 0'
    })
  }

  return errors
}
