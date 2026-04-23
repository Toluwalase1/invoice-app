import { useCallback, useState } from 'react'
import type { FormErrors, FormMode, Invoice, InvoiceFormData } from '../types/invoice.ts'
import { blankFormData } from '../data/invoices.ts'
import { validateInvoiceForm } from '../utils/invoice.ts'

/**
 * Manages the form drawer state: open/close, create vs edit mode,
 * form data, validation errors, and touched tracking.
 */
export function useInvoiceForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [formData, setFormData] = useState<InvoiceFormData>(blankFormData())
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const openCreate = useCallback(() => {
    setFormMode('create')
    setFormData(blankFormData())
    setErrors({})
    setSubmitted(false)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((invoice: Invoice) => {
    setFormMode('edit')
    setFormData({
      senderAddress: { ...invoice.senderAddress },
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientAddress: { ...invoice.clientAddress },
      issueDate: invoice.issueDate,
      paymentTerms: invoice.paymentTerms,
      description: invoice.description,
      items: invoice.items.map((item) => ({ ...item })),
    })
    setErrors({})
    setSubmitted(false)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * Validate the current formData. Returns `true` when valid.
   * When saving as draft, validation is skipped.
   */
  const validate = useCallback(
    (isDraft: boolean): boolean => {
      if (isDraft) {
        setErrors({})
        return true
      }

      setSubmitted(true)
      const newErrors = validateInvoiceForm(formData)
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [formData],
  )

  /**
   * Re-validate on every change ONLY after the user has already attempted
   * to submit (so errors clear as they fix things).
   */
  const updateFormData = useCallback(
    (updater: (current: InvoiceFormData) => InvoiceFormData) => {
      setFormData((current) => {
        const next = updater(current)
        // Live-clear errors only after first submission attempt
        if (submitted) {
          setErrors(validateInvoiceForm(next))
        }
        return next
      })
    },
    [submitted],
  )

  return {
    isOpen,
    formMode,
    formData,
    errors,
    submitted,
    openCreate,
    openEdit,
    close,
    validate,
    setFormData: updateFormData,
  } as const
}
