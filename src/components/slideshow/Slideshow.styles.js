import styled from 'styled-components';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Meta } from '../content/Content.styles';

export const Carousel = styled.div`
  position: relative;
`

// One box for all slides (#145): its size comes from the frame's shape and
// the screen, never from the slide shown, so nothing below it moves. Size
// containment makes that explicit and lets the slides size themselves
// against it with container units (cqw/cqh).
export const SlideFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio};
  max-height: calc(100vh - ${({ theme }) => theme.slideshow.viewportReserve});
  max-height: calc(100dvh - ${({ theme }) => theme.slideshow.viewportReserve});
  container-type: size;
  overflow: hidden;
`

// Inactive slides are hidden with display: none, so their lazy images only
// load when they come up.
export const Slide = styled.div`
  position: absolute;
  inset: 0;
  display: ${({ $active }) => ($active ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
`

// Each image as large as fits into the frame in its own shape: the full
// width, or the full height for anything taller than the frame. Setting
// width and aspect ratio (rather than letting the image fill the frame
// with object-fit) keeps the tinted box and the blurred placeholder in the
// image's shape while it loads.
export const SlideImage = styled(GatsbyImage)`
  width: min(100cqw, ${({ $ratio }) => $ratio} * 100cqh);
  aspect-ratio: ${({ $ratio }) => $ratio};
`

// All captions share one grid cell, so the caption area is as tall as the
// longest caption on every slide and the content below stays in place.
export const Captions = styled.div`
  display: grid;
  padding: ${({ theme }) => theme.spacing.sm} 0 0;
  text-align: center;
`

export const Caption = styled(Meta)`
  grid-area: 1 / 1;
  visibility: ${({ $active }) => ($active ? 'visible' : 'hidden')};
`

// Previous/next: a strip down each side of the frame. Next sits on the right.
export const CarouselControl = styled.div`
  ${({ $next }) => ($next ? 'right: 0;' : 'left: 0;')}
  align-items: center;
  background: transparent;   /* reset, since this now renders as <button> */
  border: none;
  bottom: 0;
  color: ${({ theme }) => theme.colors.theme.white};
  cursor: pointer;
  display: flex;
  justify-content: center;
  opacity: .5;
  padding: 0;
  position: absolute;
  text-align: center;
  top: 0;
  width: 15%;

  &:hover { opacity: .8; }

  .carousel-control-next-icon, .carousel-control-prev-icon {
    background: transparent no-repeat 50%;
    background-size: 100% 100%;
    display: inline-block;
    height: 20px;
    width: 20px;
    /* A dark edge keeps the white arrows visible where they lie on the
       white around an image narrower than the frame, such as a portrait. */
    filter: drop-shadow(0 0 2px ${({ theme }) => theme.colors.theme.black});
  }

  .carousel-control-prev-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E");
  }

  .carousel-control-next-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E");
  }
`

// Below the caption, in the flow, so they keep their place too.
export const CarouselIndicators = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 15%;

  & button{
    flex: 0 1 auto;
    height: 3px;
    width: 30px;
    margin: 0 3px;
    cursor: pointer;
    text-indent: -999px;
    overflow: hidden;
    border: 0;
    /* The active one is in the accent colour (Layout.styles.js). */
    background-color: ${({ theme }) => theme.colors.theme.lightgrey};
  }
`