import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Carousel, CarouselIndicators, CarouselInner, CarouselItem, CarouselControl } from './slideshow/Slideshow.styles'
import { Meta } from './content/Content.styles'

const Slideshow = ({ slides, length }) => (
  <Carousel id="myCarousel" className="carousel slide" data-ride="carousel">

    {/* Indicators */}
    <CarouselIndicators className="carousel-indicators">
      {slides.map(({ sizes }, index) => {
        var sldto = index;
        var cls = (index === 0) ? 'active' : '';
        return (
          <li data-target="#myCarousel" data-slide-to={sldto} className={cls}></li>
        )
      })}
    </CarouselIndicators>

    {/* Wrapper for slides */}
    <CarouselInner role="listbox">

      {slides.map(({ gatsbyImageData, description }, index) => {
        var cls = (index === 0) ? 'active' : '';
        return (
          <CarouselItem className={cls}>
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="image-wrapper 3-col">
                <GatsbyImage alt="FeaturedImage" image={gatsbyImageData} aspectratio={16 / 9} />
              </div>
              <Meta>{description}</Meta>
            </div>
          </CarouselItem>
        )
      })}


    </CarouselInner>

    {/* Left and right controls */}

      <CarouselControl className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </CarouselControl>
      <CarouselControl className="carousel-control-next" href="#myCarousel" role="button" data-slide="next" style={{right: '0'}} >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </CarouselControl>

  </Carousel>

)
export default Slideshow
