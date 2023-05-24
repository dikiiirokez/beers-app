import { useContext } from 'react'
import BeersContext from '../context/beers'

export default function useBeersContext() {
  return useContext(BeersContext)
}
