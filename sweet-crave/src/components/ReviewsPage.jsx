function formatReviewDate(value) {
  return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

export default function ReviewsPage({ reviews, onNavigate }) {
  return (
    <section className="reviews-page section-wrap" aria-labelledby="reviews-title">
      <div className="reviews-heading">
        <p className="eyebrow"><span className="eyebrow-line" /> NOTES FROM THE SWEET-TOOTH CROWD</p>
        <h1 id="reviews-title">The <em>word</em> on our treats.</h1>
        <p>Every note below was sent through our customer feedback form.</p>
      </div>
      {reviews.length ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <article className="review-entry" key={review.id}>
              <div className="review-entry-top"><span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><time dateTime={review.date}>{formatReviewDate(review.date)}</time></div>
              <p>{review.comment}</p>
              <div className="review-entry-byline"><strong>{review.name}</strong><span>{review.topic}</span></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="reviews-empty"><span className="reviews-empty-stars" aria-hidden="true">★★★★★</span><h2>First bite, first review.</h2><p>Customer comments will appear here after they share a note on our Support page.</p><a className="primary-button" href="/support" onClick={(event) => onNavigate(event, 'support')}>Leave the first review <span aria-hidden="true">↗</span></a></div>
      )}
      <p className="reviews-storage-note">Reviews currently save in this browser only. Connect a shared database to publish comments across customer devices.</p>
    </section>
  )
}