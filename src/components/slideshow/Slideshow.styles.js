import styled from 'styled-components';

export const Carousel = styled.div`
  position: relative;
`

export const CarouselInner = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`

export const CarouselItem = styled.div`
align-items: center;
  backface-visibility: hidden;
  display: none;
  perspective: 1000px;
  position: relative;
  transition: transform .6s ease;
  width: 100%;

  &.active {
    display: flex;
  }
`

export const CarouselControl = styled.div`
  align-items: center;
  bottom: 0;
  color: #fff;
  display: flex;
  justify-content: center;
  opacity: .5;
  position: absolute;
  text-align: center;
  top: 0;
  width: 15%;

  .carousel-control-next-icon, .carousel-control-prev-icon {
    background: transparent no-repeat 50%;
    background-image: none;
    background-size: auto;
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

export const ControlButton = styled.button`
  background: rgba(255,255,255,0.5);
  border: none;
  padding: 10px;
  cursor: pointer;

  i {
    font-size: 1.5em;
    color: ${props => props.theme.colors.theme.black};
  }
`

export const CarouselIndicators = styled.ol`
  bottom: -10px;
  display: flex;
  justify-content: center;
  left: 0;
  list-style: none;
  margin-left: 15%;
  margin-right: 15%;
  padding-left: 0;
  position: absolute;
  right: 0;
  z-index: 15;

  li{
    flex: 0 1 auto;
    height: 3px;
    margin-left: 3px;
    margin-right: 3px;
    position: relative;
    text-indent: -999px;
    width: 30px;
    background-color: ${props => props.theme.colors.theme.grey};
  }
  
  & li:after, & li:before {

  content: "";
  display: inline-block;
  height: 10px;
  left: 0;
  position: absolute;
  width: 100%;

`;





