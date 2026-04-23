export type InvoiceStatus = 'paid' | 'pending' | 'draft'
export type ThemeMode = 'dark' | 'light'
export type ViewMode = 'list' | 'details'
export type FormMode = 'create' | 'edit'

export type InvoiceItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type PartyAddress = {
  street: string
  city: string
  postCode: string
  country: string
}

export type Invoice = {
  id: string
  status: InvoiceStatus
  clientName: string
  clientEmail: string
  senderAddress: PartyAddress
  clientAddress: PartyAddress
  issueDate: string
  paymentTerms: string
  description: string
  items: InvoiceItem[]
}

export type Filters = {
  draft: boolean
  pending: boolean
  paid: boolean
}

export type InvoiceFormData = {
  senderAddress: PartyAddress
  clientName: string
  clientEmail: string
  clientAddress: PartyAddress
  issueDate: string
  paymentTerms: string
  description: string
  items: InvoiceItem[]
}

/**
 * Validation errors keyed by field path (e.g. "clientName", "items.0.name").
 * Value is the human-readable error message.
 */
export type FormErrors = Record<string, string>
