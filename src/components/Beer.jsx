function Beer({ beer }) {
  const { name, image_url, first_brewed, description } = beer

  return (
    <article className="beer-item">
      <div className="beer-item__left-container">
        <img className="beer-item__img" src={image_url} alt={name} />
      </div>
      <div className="beer-item__right-container">
        <h2 className="beer-item__name">{name}</h2>
        <p className="beer-item__brewed-date">{first_brewed}</p>
        <p className="beer-item__desc">{description}</p>
      </div>
    </article>
  )
}

export default Beer
