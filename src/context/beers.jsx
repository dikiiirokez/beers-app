import { createContext, useCallback, useRef, useState } from 'react'
import axios from 'axios'

const DEFAULTS = {
  SORT_FIELD_NAME_STR: 'sortFieldName',
  SORT_FIELD_VALUE_STR: 'sortFieldValue',
  NUM_BEERS_PER_PAGE_STR: 'numBeersPerPage',
  NAME_STR: 'name',
  BREWED_DATE_STR: 'brewed_date',
  ASCENDING_STR: 'ascending',
  DESCENDING_STR: 'descending',
}

const FIELD_NAMES = new Set([DEFAULTS.NAME_STR, DEFAULTS.BREWED_DATE_STR])
const FIELD_VALUES = new Set([DEFAULTS.ASCENDING_STR, DEFAULTS.DESCENDING_STR])

const checkValue = (value) => {
  if (value === DEFAULTS.SORT_FIELD_NAME_STR)
    return FIELD_NAMES.has(localStorage.getItem(value))
      ? localStorage.getItem(value)
      : DEFAULTS.NAME_STR
  else if (value === DEFAULTS.SORT_FIELD_VALUE_STR)
    return FIELD_VALUES.has(localStorage.getItem(value))
      ? localStorage.getItem(value)
      : DEFAULTS.ASCENDING_STR
  else if (value === DEFAULTS.NUM_BEERS_PER_PAGE_STR)
    return !isFinite(localStorage.getItem(value))
      ? +localStorage.getItem(value)
      : 6
}

const BeersContext = createContext()

function Provider({ children }) {
  const sortFieldNameToShare = useRef(checkValue(DEFAULTS.SORT_FIELD_NAME_STR))
  const sortFieldValueToShare = useRef(
    checkValue(DEFAULTS.SORT_FIELD_VALUE_STR)
  )
  const numBeersPerPageToShare = useRef(
    checkValue(DEFAULTS.NUM_BEERS_PER_PAGE_STR)
  )
  const currentPageToShare = useRef(1)
  // const navigate = useNavigate()

  const [beers, setBeers] = useState([])

  const sortArrayBy = useCallback((beers, sortFieldName, sortFieldValue) => {
    localStorage.setItem(DEFAULTS.SORT_FIELD_NAME_STR, sortFieldName)
    localStorage.setItem(DEFAULTS.SORT_FIELD_VALUE_STR, sortFieldValue)
    const beersSorted = [...beers]

    if (sortFieldName === DEFAULTS.NAME_STR)
      if (sortFieldValue === DEFAULTS.ASCENDING_STR)
        beersSorted.sort((beer1, beer2) => (beer1.name < beer2.name ? -1 : 1))
      else if (sortFieldValue === DEFAULTS.DESCENDING_STR)
        beersSorted.sort((beer1, beer2) => (beer1.name < beer2.name ? 1 : -1))

    if (sortFieldName === 'brewed_date')
      if (sortFieldValue === DEFAULTS.ASCENDING_STR)
        beersSorted.sort((beer1, beer2) => {
          const [monthBeer1, yearBeer1] = beer1.first_brewed.split('/')
          const dateBeer1 = new Date(yearBeer1, monthBeer1 - 1)
          const [monthBeer2, yearBeer2] = beer2.first_brewed.split('/')
          const dateBeer2 = new Date(yearBeer2, monthBeer2 - 1)

          return dateBeer1 < dateBeer2 ? -1 : 1
        })
      else if (sortFieldValue === DEFAULTS.DESCENDING_STR)
        beersSorted.sort((beer1, beer2) => {
          const [monthBeer1, yearBeer1] = beer1.first_brewed.split('/')
          const dateBeer1 = new Date(yearBeer1, monthBeer1 - 1)
          const [monthBeer2, yearBeer2] = beer2.first_brewed.split('/')
          const dateBeer2 = new Date(yearBeer2, monthBeer2 - 1)

          return dateBeer1 < dateBeer2 ? 1 : -1
        })

    setBeers(beersSorted)
  }, [])

  const fetchBeers = useCallback(
    async (sortFieldName, sortFieldValue, numBeersPerPage, pageNumber = 1) => {
      if (sortFieldName && sortFieldValue && numBeersPerPage) {
        sortFieldNameToShare.current = FIELD_NAMES.has(sortFieldName)
          ? sortFieldName
          : DEFAULTS.NAME_STR
        sortFieldValueToShare.current = FIELD_VALUES.has(sortFieldValue)
          ? sortFieldValue
          : DEFAULTS.ASCENDING_STR
        numBeersPerPageToShare.current = !isNaN(numBeersPerPage)
          ? +numBeersPerPage
          : 3
      }

      localStorage.setItem(
        DEFAULTS.NUM_BEERS_PER_PAGE_STR,
        numBeersPerPageToShare.current
      )

      const { data: beers } = await axios.get(
        `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=${numBeersPerPageToShare.current}`
      )

      currentPageToShare.current = pageNumber

      sortArrayBy(
        beers,
        sortFieldNameToShare.current,
        sortFieldValueToShare.current
      )
    },
    [sortArrayBy]
  )

  function sortBeersBy(sortFieldName, sortFieldValue) {
    sortArrayBy(beers, sortFieldName, sortFieldValue)
  }

  const localOptions = {
    sortFieldName: sortFieldNameToShare.current,
    sortFieldValue: sortFieldValueToShare.current,
    numBeersPerPage: numBeersPerPageToShare.current,
    currentPage: currentPageToShare.current,
  }

  const beersContext = {
    beers,
    fetchBeers,
    sortBeersBy,
    localOptions,
  }

  return (
    <BeersContext.Provider value={beersContext}>
      {children}
    </BeersContext.Provider>
  )
}

export { Provider }
export default BeersContext
