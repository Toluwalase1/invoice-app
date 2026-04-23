import type { Invoice } from '../../types/invoice.ts'
import { formatCurrency, formatDate, statusLabel, sumItems } from '../../utils/invoice.ts'

type InvoiceListProps = {
  invoices: Invoice[]
  onOpenDetails: (id: string) => void
}

export function InvoiceList({ invoices, onOpenDetails }: InvoiceListProps) {
  return (
    <ul className="invoice-list">
      {invoices.map((invoice) => {
        const total = sumItems(invoice.items)

        return (
          <li key={invoice.id}>
            <button type="button" className="invoice-card" onClick={() => onOpenDetails(invoice.id)}>
              <span className="invoice-id">#{invoice.id}</span>
              <span className="invoice-date">Due {formatDate(invoice.issueDate)}</span>
              <span className="invoice-client">{invoice.clientName}</span>
              <strong className="invoice-total">{formatCurrency(total)}</strong>
              <span className={`status-pill status-${invoice.status}`}>
                <span className="dot" />
                {statusLabel(invoice.status)}
              </span>
              <span className="go">›</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
