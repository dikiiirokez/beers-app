import Beer from './components/Beer'
import useBeersContext from './hooks/useBeersContext'

function BeerList() {
  const { beers } = useBeersContext()

  let content = <p className="fail-load-message">SOMETHING WENT WRONG</p>

  if (beers.length)
    content = (
      <div className="beers-container">
        {beers.map((beer) => (
          <Beer key={beer.id} beer={beer} />
        ))}
      </div>
    )

  return <div>{content}</div>
}

export default BeerList
