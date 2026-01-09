import styled from 'styled-components';

export const CarouselControl = styled.div`
  background: none !important;
  text-shadow: 0px 2px 4px rgba(0,0,0,0.2);
`;

export const CarouselIndicators = styled.div`
  bottom: 0px;

  li {
    background-color: ${props => props.theme.colors.theme.lightgrey};
  }
`;

export const ResponsiveVideo = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* Default for 1600x900 videos 16:9 ratio*/
  padding-top: 0px;
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const VideosButton = styled.button`
  background: transparent;
  box-shadow: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const Address = styled.div`
  div {
    display: inline;
    background: rgb(0, 239, 0);
  }
`;
