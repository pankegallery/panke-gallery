import React from 'react'
import Img from 'gatsby-image'

export default ({images }) => (

  <section className="further">
    <div className="col-md-12 col-xs-12">

      {images.map(({sizes, description}) => {
        return (
          <div className="image-wrapper 3col">
            <Img alt="Documentation of the exhibition" sizes={{...sizes, aspectRatio: 16/9}} />
            <p>{description}</p>
          </div>
        )
      })}
    </div>
  </section>

)
