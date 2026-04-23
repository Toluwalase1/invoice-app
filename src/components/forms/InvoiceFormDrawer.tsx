import { useEffect, useRef } from 'react'
import type { FormErrors, FormMode, Invoice, InvoiceFormData, InvoiceStatus } from '../../types/invoice.ts'
import { formatCurrency } from '../../utils/invoice.ts'

type InvoiceFormDrawerProps = {
  isOpen: boolean
  formMode: FormMode
  selectedInvoice: Invoice | null
  formData: InvoiceFormData
  setFormData: (updater: (current: InvoiceFormData) => InvoiceFormData) => void
  errors: FormErrors
  submitted: boolean
  paymentOptions: string[]
  onClose: () => void
  onSave: (status: InvoiceStatus) => void
}

/**
 * Helper: returns the CSS class for an input that may have an error.
 */
function inputClass(errors: FormErrors, field: string) {
  return errors[field] ? 'input-error' : ''
}

export function InvoiceFormDrawer({
  isOpen,
  formMode,
  selectedInvoice,
  formData,
  setFormData,
  errors,
  submitted,
  paymentOptions,
  onClose,
  onSave,
}: InvoiceFormDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)

  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus the drawer when it opens
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const hasItemsError = submitted && errors['items']

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <section
        ref={drawerRef}
        className="invoice-drawer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={formMode === 'create' ? 'Create new invoice' : `Edit invoice ${selectedInvoice?.id ?? ''}`}
        tabIndex={-1}
      >
        <h2>{formMode === 'create' ? 'New Invoice' : `Edit #${selectedInvoice?.id ?? ''}`}</h2>

        {/* ── Bill From ── */}
        <div className="form-section">
          <h3>Bill From</h3>
          <label>
            <span className="label-row">
              Street Address
              {errors['senderStreet'] && <span className="error-message">{errors['senderStreet']}</span>}
            </span>
            <input
              className={inputClass(errors, 'senderStreet')}
              value={formData.senderAddress.street}
              aria-invalid={!!errors['senderStreet']}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  senderAddress: { ...current.senderAddress, street: event.target.value },
                }))
              }
            />
          </label>

          <div className="grid-3">
            <label>
              <span className="label-row">
                City
                {errors['senderCity'] && <span className="error-message">{errors['senderCity']}</span>}
              </span>
              <input
                className={inputClass(errors, 'senderCity')}
                value={formData.senderAddress.city}
                aria-invalid={!!errors['senderCity']}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    senderAddress: { ...current.senderAddress, city: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span className="label-row">
                Post Code
                {errors['senderPostCode'] && <span className="error-message">{errors['senderPostCode']}</span>}
              </span>
              <input
                className={inputClass(errors, 'senderPostCode')}
                value={formData.senderAddress.postCode}
                aria-invalid={!!errors['senderPostCode']}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    senderAddress: { ...current.senderAddress, postCode: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span className="label-row">
                Country
                {errors['senderCountry'] && <span className="error-message">{errors['senderCountry']}</span>}
              </span>
              <input
                className={inputClass(errors, 'senderCountry')}
                value={formData.senderAddress.country}
                aria-invalid={!!errors['senderCountry']}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    senderAddress: { ...current.senderAddress, country: event.target.value },
                  }))
                }
              />
            </label>
          </div>
        </div>

        {/* ── Bill To ── */}
        <div className="form-section">
          <h3>Bill To</h3>
          <label>
            <span className="label-row">
              Client's Name
              {errors['clientName'] && <span className="error-message">{errors['clientName']}</span>}
            </span>
            <input
              className={inputClass(errors, 'clientName')}
              value={formData.clientName}
              aria-invalid={!!errors['clientName']}
              onChange={(event) =>
                setFormData((current) => ({ ...current, clientName: event.target.value }))
              }
            />
          </label>
          <label>
            <span className="label-row">
              Client's Email
              {errors['clientEmail'] && <span className="error-message">{errors['clientEmail']}</span>}
            </span>
            <input
              className={inputClass(errors, 'clientEmail')}
              value={formData.clientEmail}
              aria-invalid={!!errors['clientEmail']}
              placeholder="e.g. email@example.com"
              onChange={(event) =>
                setFormData((current) => ({ ...current, clientEmail: event.target.value }))
              }
            />
          </label>
          <label>
            <span className="label-row">
              Street Address
              {errors['clientStreet'] && <span className="error-message">{errors['clientStreet']}</span>}
            </span>
            <input
              className={inputClass(errors, 'clientStreet')}
              value={formData.clientAddress.street}
              aria-invalid={!!errors['clientStreet']}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  clientAddress: { ...current.clientAddress, street: event.target.value },
                }))
              }
            />
          </label>

          <div className="grid-3">
            <label>
              <span className="label-row">
                City
                {errors['clientCity'] && <span className="error-message">{errors['clientCity']}</span>}
              </span>
              <input
                className={inputClass(errors, 'clientCity')}
                value={formData.clientAddress.city}
                aria-invalid={!!errors['clientCity']}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    clientAddress: { ...current.clientAddress, city: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span className="label-row">
                Post Code
                {errors['clientPostCode'] && <span className="error-message">{errors['clientPostCode']}</span>}
              </span>
              <input
                className={inputClass(errors, 'clientPostCode')}
                value={formData.clientAddress.postCode}
                aria-invalid={!!errors['clientPostCode']}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    clientAddress: { ...current.clientAddress, postCode: event.target.value },
                  }))
                }
              />
            </label>
            <label>
              <span className="label-row">
                Country
                {errors['clientCountry'] && <span className="error-message">{errors['clientCountry']}</span>}
              </span>
              <input
                className={inputClass(errors, 'clientCountry')}
                value={formData.clientAddress.country}
                aria-invalid={!!errors['clientCountry']}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    clientAddress: { ...current.clientAddress, country: event.target.value },
                  }))
                }
              />
            </label>
          </div>

          <div className="grid-2">
            <label>
              <span className="label-row">
                Invoice Date
                {errors['issueDate'] && <span className="error-message">{errors['issueDate']}</span>}
              </span>
              <input
                type="date"
                className={inputClass(errors, 'issueDate')}
                value={formData.issueDate}
                aria-invalid={!!errors['issueDate']}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, issueDate: event.target.value }))
                }
              />
            </label>
            <label>
              Payment Terms
              <select
                value={formData.paymentTerms}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, paymentTerms: event.target.value }))
                }
              >
                {paymentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span className="label-row">
              Project Description
              {errors['description'] && <span className="error-message">{errors['description']}</span>}
            </span>
            <input
              className={inputClass(errors, 'description')}
              value={formData.description}
              aria-invalid={!!errors['description']}
              onChange={(event) =>
                setFormData((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
        </div>

        {/* ── Item List ── */}
        <div className="form-section">
          <h3 className="items-heading">Item List</h3>
          {formData.items.map((item, index) => (
            <div key={item.id} className="item-row">
              <label>
                <span className="label-row">
                  Item Name
                  {errors[`items.${index}.name`] && (
                    <span className="error-message">{errors[`items.${index}.name`]}</span>
                  )}
                </span>
                <input
                  className={inputClass(errors, `items.${index}.name`)}
                  value={item.name}
                  aria-invalid={!!errors[`items.${index}.name`]}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      items: current.items.map((row) =>
                        row.id === item.id ? { ...row, name: event.target.value } : row,
                      ),
                    }))
                  }
                />
              </label>
              <label>
                Qty.
                <input
                  type="number"
                  min={1}
                  className={inputClass(errors, `items.${index}.quantity`)}
                  value={item.quantity}
                  aria-invalid={!!errors[`items.${index}.quantity`]}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      items: current.items.map((row) =>
                        row.id === item.id ? { ...row, quantity: Number(event.target.value) || 1 } : row,
                      ),
                    }))
                  }
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={inputClass(errors, `items.${index}.price`)}
                  value={item.price}
                  aria-invalid={!!errors[`items.${index}.price`]}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      items: current.items.map((row) =>
                        row.id === item.id ? { ...row, price: Number(event.target.value) || 0 } : row,
                      ),
                    }))
                  }
                />
              </label>
              <div className="line-total">{formatCurrency(item.quantity * item.price)}</div>
              <button
                type="button"
                className="remove-item"
                aria-label={`Remove ${item.name || 'item'}`}
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    items: current.items.filter((row) => row.id !== item.id),
                  }))
                }
              >
                🗑
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-item"
            onClick={() =>
              setFormData((current) => ({
                ...current,
                items: [
                  ...current.items,
                  {
                    id: crypto.randomUUID(),
                    name: '',
                    quantity: 1,
                    price: 0,
                  },
                ],
              }))
            }
          >
            + Add New Item
          </button>

          {hasItemsError && <p className="form-error-banner">{errors['items']}</p>}
        </div>

        {/* ── Validation summary ── */}
        {submitted && Object.keys(errors).length > 0 && (
          <div className="form-errors-summary" role="alert">
            <p>– All fields must be added</p>
          </div>
        )}

        {/* ── Footer actions ── */}
        <footer className="drawer-footer">
          <button type="button" className="btn ghost" onClick={onClose}>
            {formMode === 'create' ? 'Discard' : 'Cancel'}
          </button>
          <div className="drawer-right-actions">
            {formMode === 'create' ? (
              <button type="button" className="btn muted" onClick={() => onSave('draft')}>
                Save as Draft
              </button>
            ) : null}
            <button
              type="button"
              className="btn primary"
              onClick={() => onSave(formMode === 'create' ? 'pending' : selectedInvoice?.status ?? 'pending')}
            >
              {formMode === 'create' ? 'Save & Send' : 'Save Changes'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}
