import React, { useState, useEffect, useCallback } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Carousel, CarouselIndicators, CarouselInner, CarouselItem, CarouselControl } from './slideshow/Slideshow.styles'
import { Meta } from './content/Content.styles'

/**
 * The image slideshow on exhibition, event and edition pages: one slide at a
 * time with its description as caption, moving on every `interval` ms.
 *
 * @param {Object} props
 * @param {Object[]} props.slides - Contentful images with `gatsbyImageData`
 *   and `description`.
 * @param {string} props.alt - Alt text for slides without a description,
 *   e.g. the exhibition's title.
 * @param {number} [props.interval=5000] - Time per slide in ms; 0 stops it.
 */
const Slideshow = ({ slides, alt, interval = 5000 }) => {
  const [active, setActive] = useState(0)
  const count = slides.length

  const goTo = useCallback(i => setActive((i + count) % count), [count])
  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    if (count <= 1 || !interval) return
    const id = setTimeout(next, interval)
    return () => clearTimeout(id)
  }, [active, count, interval, next])

  if (!count) return null

  return (
    <Carousel id="myCarousel">

      {/* Indicators */}
      <CarouselIndicators className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Slide ${index + 1}`}
            aria-current={index === active ? 'true' : undefined}
            className={index === active ? 'active' : ''}
          />
        ))}
      </CarouselIndicators>

      {/* Wrapper for slides */}
      <CarouselInner>
        {slides.map(({ gatsbyImageData, description }, index) => (
          <CarouselItem key={index} $active={index === active} aria-hidden={index !== active}>
            <div>
              <div className="image-wrapper 3-col">
                <GatsbyImage alt={description || alt} image={gatsbyImageData} />
              </div>
              <Meta style={{ textAlign: 'center', padding: '10px 0' }}>{description}</Meta>
            </div>
          </CarouselItem>
        ))}
      </CarouselInner>

      {/* Controls */}
      {count > 1 && (
        <>
          <CarouselControl as="button" type="button" onClick={prev} aria-label="Previous">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </CarouselControl>
          <CarouselControl as="button" type="button" onClick={next} aria-label="Next" style={{ right: 0 }}>
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </CarouselControl>
        </>
      )}

    </Carousel>
  )
}

export default Slideshow