import React, { useState, useEffect, useCallback } from 'react'
import { Carousel, SlideFrame, Slide, SlideImage, Captions, Caption, CarouselIndicators, CarouselControl } from './slideshow/Slideshow.styles'
import { theme } from '../theme/theme'

// Width / height of a slide's image.
const ratioOf = ({ gatsbyImageData: { width, height } }) => width / height

/**
 * The frame's shape: that of the slideshow's typical slide (the median
 * shape, the wider one of the middle two), kept between 3:2 and 16:9
 * (`theme.slideshow.ratio`). Most slides then fill the frame, and a
 * slideshow of one shape looks as before.
 *
 * @param {Object[]} slides - Slides with `gatsbyImageData`.
 * @returns {number} Width / height of the frame.
 */
const frameRatioOf = slides => {
  const { min, max } = theme.slideshow.ratio
  const ratios = slides.map(ratioOf).sort((x, y) => x - y)
  const typical = ratios[Math.floor(ratios.length / 2)]
  return Math.min(max, Math.max(min, typical))
}

/**
 * The image slideshow on exhibition, event and edition pages: one slide at a
 * time with its description as caption, moving on every `interval` ms.
 * All slides share one frame whose size doesn't depend on the slide shown,
 * and each image fits into it uncut (#145), so the page doesn't jump.
 *
 * @param {Object} props
 * @param {Object[]} props.slides - Contentful images with `gatsbyImageData`
 *   and `description`.
 * @param {string} props.alt - Alt text for slides without a description,
 *   e.g. the exhibition's title.
 * @param {number} [props.interval=5000] - Time per slide in ms; 0 stops it.
 */
const Slideshow = ({ slides: allSlides, alt, interval = 5000 }) => {
  // A slide without image data (e.g. a broken upload) would show nothing
  // and has no shape for the frame, so it is left out.
  const slides = allSlides.filter(slide => slide?.gatsbyImageData)
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

      <SlideFrame $ratio={frameRatioOf(slides)}>
        {slides.map((slide, index) => (
          <Slide key={index} $active={index === active} aria-hidden={index !== active}>
            <SlideImage alt={slide.description || alt} image={slide.gatsbyImageData} $ratio={ratioOf(slide)} />
          </Slide>
        ))}

        {/* Controls */}
        {count > 1 && (
          <>
            <CarouselControl as="button" type="button" onClick={prev} aria-label="Previous">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
            </CarouselControl>
            <CarouselControl as="button" type="button" onClick={next} aria-label="Next" $next>
              <span className="carousel-control-next-icon" aria-hidden="true" />
            </CarouselControl>
          </>
        )}
      </SlideFrame>

      <Captions>
        {slides.map(({ description }, index) => (
          <Caption key={index} $active={index === active}>{description}</Caption>
        ))}
      </Captions>

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

    </Carousel>
  )
}

export default Slideshow