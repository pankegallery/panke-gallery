import React from 'react'
import Img from 'gatsby-image'
//import Carousel from 'react-responsive-carousel'

export default ({slides, length}) => (
  <div id="myCarousel" className="row carousel slide" data-ride="carousel">



    {/* Indicators */}
    <ol className="carousel-indicators">
        <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
        <li data-target="#myCarousel" data-slide-to="1"></li>
        <li data-target="#myCarousel" data-slide-to="2"></li>
        <li data-target="#myCarousel" data-slide-to="3"></li>
        <li data-target="#myCarousel" data-slide-to="4"></li>
        <li data-target="#myCarousel" data-slide-to="5"></li>
        <li data-target="#myCarousel" data-slide-to="6"></li>
        <li data-target="#myCarousel" data-slide-to="7"></li>
        <li data-target="#myCarousel" data-slide-to="8"></li>
        <li data-target="#myCarousel" data-slide-to="9"></li>
        <li data-target="#myCarousel" data-slide-to="9"></li>
    </ol>

    {/* Wrapper for slides */}
    <div className="carousel-inner" role="listbox">

      {slides.map(({sizes, description}, index ) => {
        var cls = (index === 0) ? 'carousel-item active' : 'carousel-item';
        return (
          <div className={cls}>
            <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="image-wrapper 3-col">
                    <Img alt="FeaturedImage" sizes={{...sizes , aspectRatio: 16/9}} />
                </div>
                <p>{description}</p>
            </div>
          </div>
        )
      })}



    </div>

    {/* Left and right controls */}

    <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
    </a>
    <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
    </a>
  </div>

)
