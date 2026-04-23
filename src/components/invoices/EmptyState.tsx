import emptyIllustration from '../../assets/Email campaign_Flatline 2.png'

export function EmptyState() {
  return (
    <div className="empty-state">
      <img src={emptyIllustration} alt="No invoices illustration" />
      <h2>There is nothing here</h2>
      <p>
        Create an invoice by clicking the
        <br />
        <strong>New</strong> button and get started
      </p>
    </div>
  )
}
