import useBeersContext from './hooks/useBeersContext'

function PaginatorBar() {
  const { fetchBeers, localOptions } = useBeersContext()

  function handleClick(evt) {
    const { sortFieldName, sortFieldValue, numBeersPerPage, currentPage } =
      localOptions
    const targetNumPage =
      evt.target.name === 'previous' ? currentPage - 1 : currentPage + 1

    fetchBeers(sortFieldName, sortFieldValue, numBeersPerPage, targetNumPage)
  }

  return (
    <div className="footer">
      <button
        onClick={handleClick}
        className="footer__item footer__item--previous"
        name="previous"
      >
        Previous
      </button>
      <button className="footer__item footer__item--current">
        {localOptions.currentPage}
      </button>
      <button
        onClick={handleClick}
        className="footer__item footer__item--next"
        name="next"
      >
        Next
      </button>
    </div>
  )
}
export default PaginatorBar
