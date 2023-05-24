import { useState } from 'react'
import useBeersContext from './hooks/useBeersContext'
import { useNavigate } from 'react-router-dom'

function ControlsBar() {
  const { sortBeersBy, fetchBeers, localOptions } = useBeersContext()
  const navigate = useNavigate()
  const { sortFieldName, sortFieldValue, numBeersPerPage, currentPage } =
    localOptions

  const [selectedValues, setSelectedValues] = useState({
    name: sortFieldValue,
    brewed_date: sortFieldValue,
    beers_per_page: numBeersPerPage,
  })

  const [activeSortField, setActiveSortField] = useState(sortFieldName)

  const handleChange = (evt) => {
    const { name, value } = evt.target

    const isBeersPerPage = name === 'beers_per_page'

    setSelectedValues((prevOptions) => ({
      ...prevOptions,
      [name]: isBeersPerPage ? +value : value,
    }))

    if (isBeersPerPage)
      fetchBeers(activeSortField, selectedValues[activeSortField], +value)
    else {
      setActiveSortField(name)
      sortBeersBy(name, isBeersPerPage ? +value : value)
    }

    name === 'beers_per_page'
      ? navigate(
          `/beers?sort_by=${
            activeSortField === 'name' ? 'name' : 'brewed_date'
          }&sort_order=${
            activeSortField === 'name'
              ? selectedValues['name']
              : selectedValues['brewed_date']
          }&beers_per_page=${value}&current_page=${currentPage}`
        )
      : navigate(
          `/beers?sort_by=${name}&sort_order=${value}&beers_per_page=${numBeersPerPage}&current_page=${currentPage}`
        )
  }

  return (
    <div className="controls-bar-container">
      <form className="controls-bar">
        <div
          className={`sort-element sort-element--select ${
            activeSortField === 'name' ? 'active' : ''
          }`}
        >
          <label htmlFor="name">Sort by name</label>
          <select
            id="name"
            value={selectedValues.name}
            onChange={handleChange}
            name="name"
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
        <div
          className={`sort-element sort-element--select ${
            activeSortField === 'brewed_date' ? 'active' : ''
          }`}
        >
          <label htmlFor="brewed_date">Sort by brewed date</label>
          <select
            id="brewed_date"
            value={selectedValues.brewed_date}
            onChange={handleChange}
            name="brewed_date"
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
        <div className="sort-element sort-element--input">
          <label htmlFor="beers_per_page">Beers per page</label>
          <input
            type="number"
            min={1}
            value={selectedValues.beers_per_page}
            onChange={handleChange}
            name="beers_per_page"
          />
        </div>
      </form>
    </div>
  )
}

export default ControlsBar
