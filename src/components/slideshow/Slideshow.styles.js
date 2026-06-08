import styled from 'styled-components';

export const Carousel = styled.div`
  position: relative;
`

export const CarouselInner = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
`

export const CarouselItem = styled.div`
  align-items: center;
  position: relative;
  width: 100%;
  display: ${({ $active }) => ($active ? 'flex' : 'none')};
`

export const CarouselControl = styled.div`
  align-items: center;
  background: transparent;   /* reset, since this now renders as <button> */
  border: none;
  bottom: 0;
  color: #fff;
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
  }

  .carousel-control-prev-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E");
  }

  .carousel-control-next-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E");
  }
`

export const CarouselIndicators = styled.div`
  bottom: 0px;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  list-style: none;
  margin: 0 15%;
  padding-left: 0;
  position: absolute;
  z-index: 15;

  & button{
    flex: 0 1 auto;
    height: 3px;
    width: 30px;
    margin: 0 3px;
    cursor: pointer;
    text-indent: -999px;
    overflow: hidden;
    border: 0;
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.theme.black : theme.colors.theme.lightgrey};
  }
`