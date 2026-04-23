import type { Invoice } from '../../types/invoice.ts'
import { dueDate, formatCurrency, formatDate, statusLabel, sumItems } from '../../utils/invoice.ts'

type InvoiceDetailsProps = {
  invoice: Invoice
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onMarkAsPaid: () => void
}

export function InvoiceDetails({ invoice, onBack, onEdit, onDelete, onMarkAsPaid }: InvoiceDetailsProps) {
  return (
    <section className="details-view">
      <button type="button" className="back-link" onClick={onBack}>
        ‹ Go back
      </button>

      <header className="status-bar">
        <div className="status-left">
          <span>Status</span>
          <span className={`status-pill status-${invoice.status}`}>
            <span className="dot" />
            {statusLabel(invoice.status)}
          </span>
        </div>

        {/* Desktop / Tablet: actions inline in status bar */}
        <div className="status-actions desktop-actions">
          <button type="button" className="btn ghost" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="btn danger" onClick={onDelete}>
            Delete
          </button>
          {invoice.status !== 'paid' && (
            <button type="button" className="btn primary" onClick={onMarkAsPaid}>
              Mark as Paid
            </button>
          )}
        </div>
      </header>

      <article className="details-card">
        <div className="details-head">
          <div>
            <h2>#{invoice.id}</h2>
            <p>{invoice.description}</p>
          </div>

          <address>
            <div>{invoice.senderAddress.street}</div>
            <div>{invoice.senderAddress.city}</div>
            <div>{invoice.senderAddress.postCode}</div>
            <div>{invoice.senderAddress.country}</div>
          </address>
        </div>

        <div className="details-meta">
          <div>
            <p>Invoice Date</p>
            <h3>{formatDate(invoice.issueDate)}</h3>
            <p>Payment Due</p>
            <h3>{formatDate(dueDate(invoice.issueDate, invoice.paymentTerms))}</h3>
          </div>
          <div>
            <p>Bill To</p>
            <h3>{invoice.clientName}</h3>
            <p>{invoice.clientAddress.street}</p>
            <p>{invoice.clientAddress.city}</p>
            <p>{invoice.clientAddress.postCode}</p>
            <p>{invoice.clientAddress.country}</p>
          </div>
          <div>
            <p>Sent to</p>
            <h3>{invoice.clientEmail}</h3>
          </div>
        </div>

        {/* Desktop / Tablet: full table with headers */}
        <div className="items-table desktop-items-table">
          <div className="table-head">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          {invoice.items.map((item) => (
            <div key={item.id} className="table-row">
              <strong>{item.name}</strong>
              <span>{item.quantity}</span>
              <span>{formatCurrency(item.price)}</span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="table-total">
            <span>Amount Due</span>
            <strong>{formatCurrency(sumItems(invoice.items))}</strong>
          </div>
        </div>

        {/* Mobile: compact item list (no table headers, shows qty × price) */}
        <div className="items-table mobile-items-table">
          {invoice.items.map((item) => (
            <div key={item.id} className="mobile-item-row">
              <div>
                <strong>{item.name}</strong>
                <span className="mobile-item-qty">
                  {item.quantity} x {formatCurrency(item.price)}
                </span>
              </div>
              <strong className="mobile-item-total">{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="table-total">
            <span>Grand Total</span>
            <strong>{formatCurrency(sumItems(invoice.items))}</strong>
          </div>
        </div>
      </article>

      {/* Mobile: fixed bottom action bar */}
      <footer className="mobile-actions-bar">
        <button type="button" className="btn ghost" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn danger" onClick={onDelete}>
          Delete
        </button>
        {invoice.status !== 'paid' && (
          <button type="button" className="btn primary" onClick={onMarkAsPaid}>
            Mark as Paid
          </button>
        )}
      </footer>
    </section>
  )
}
