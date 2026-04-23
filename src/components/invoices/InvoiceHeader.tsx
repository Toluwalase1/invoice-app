import type { Filters } from '../../types/invoice.ts'

type InvoiceHeaderProps = {
  summaryText: string
  showFilter: boolean
  filters: Filters
  onToggleFilter: () => void
  onToggleStatus: (status: keyof Filters) => void
  onCreate: () => void
}

export function InvoiceHeader({
  summaryText,
  showFilter,
  filters,
  onToggleFilter,
  onToggleStatus,
  onCreate,
}: InvoiceHeaderProps) {
  return (
    <header className="top-header">
      <div>
        <h1>Invoices</h1>
        <p>{summaryText}</p>
      </div>

      <div className="header-actions">
        <div className="filter-box">
          <button type="button" className="filter-button" onClick={onToggleFilter}>
            <span className="filter-full-text">Filter by status</span>
            <span className="filter-short-text">Filter</span>
            <span className="caret">▾</span>
          </button>

          {showFilter ? (
            <div className="filter-menu">
              <label>
                <input
                  type="checkbox"
                  checked={filters.draft}
                  onChange={() => onToggleStatus('draft')}
                />
                Draft
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.pending}
                  onChange={() => onToggleStatus('pending')}
                />
                Pending
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.paid}
                  onChange={() => onToggleStatus('paid')}
                />
                Paid
              </label>
            </div>
          ) : null}
        </div>

        <button type="button" className="new-button" onClick={onCreate}>
          <span className="plus">+</span>
          <span>New Invoice</span>
        </button>
      </div>
    </header>
  )
}
