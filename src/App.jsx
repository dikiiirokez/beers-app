import { useEffect } from 'react'
import useBeersContext from './hooks/useBeersContext'

import ControlsBar from './ControlsBar'
import BeersList from './BeerList'
import PaginatorBar from './PaginatorBar'

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from 'react-router-dom'

import './App.css'

function App() {
  const { fetchBeers, localOptions } = useBeersContext()

  const { sortFieldName, sortFieldValue, numBeersPerPage, currentPage } =
    localOptions
  useEffect(() => {
    fetchBeers()
  }, [fetchBeers])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={`/beers?sort_by=${sortFieldName}&sort_order=${sortFieldValue}&beers_per_page=${numBeersPerPage}&current_page=${currentPage}`}
            />
          }
        />
        <Route
          path="/beers"
          element={
            <div className="app">
              <ControlsBar />
              <BeersList />
              <PaginatorBar />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
