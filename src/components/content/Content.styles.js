import styled from 'styled-components';

export const NewsSection = styled.section`
  &::after {
    border-bottom: 1px solid #333;
    content: "";
    width: 40px;
    clear: both;
    display: inline-block;
    height: 32px;
    margin-left: -20px;
  }
`;

export const Section = styled.section`
  margin: ${props => props.$margin || '0'};
`;

export const Headline = styled.div`
  h1, h2 {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: ${props => props.theme.fontWeights.light};
    margin-bottom: 1em;
  }

  h1 {
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  > div {
    padding-bottom: 1.5em;
    padding-top: 2em;
  }
`;

export const Article = styled.article`
  margin: 0 0 30px;

  &:last-child {
    margin: 0;
    padding: 0;
  }

  h3 {
    margin: 1em 0 1em;
    
    small {
      font-size: 1em;
      font-weight: ${props => props.theme.fontWeights.light};
      padding-left: 1em;
    }
  }

  p small {
    font-size: 1em;
    font-weight: ${props => props.theme.fontWeights.light};
    padding-left: 1em;
  }
`;

export const NewsArticle = styled(Article)`
  margin: 0 0 30px;
`;

export const Meta = styled.p`
  color: ${props => props.theme.colors.theme.grey};
`;

export const Tag = styled.p`
  display: inline-block;
  padding: 4px 8px;
  border: ${props => props.theme.colors.theme.grey} 2px solid;
  border-radius: 5px;
  background: transparent;
  color: ${props => props.theme.colors.theme.grey};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: ${props => props.theme.fontSizes.medium};
  margin-top: 10px;
  margin-right: 10px;

  &.tag-selected {
    background: ${props => props.theme.colors.theme.grey};
    color: ${props => props.theme.colors.theme.white} !important;

    &::before {
      content: "×";
      display: inline-block;
      margin-right: 1em;
    }
  }
`;

export const EventSeries = styled(Tag)`
  /* inherits highlight-color and highlight-background from container */
`;

export const InfoSection = styled.div`
  margin: 3em 0 0;

  h2 {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: ${props => props.theme.fontWeights.light};
    margin-bottom: 1em;
  }

  p {
    font-weight: ${props => props.theme.fontWeights.medium};

    img {
      max-width: 100%;
    }
  }
`;

export const FurtherSection = styled.div`
  margin: 3em 0 0;

  h2 {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: ${props => props.theme.fontWeights.light};
    margin-bottom: 1em;
  }

  h4 {
    font-size: 1em;
    font-weight: ${props => props.theme.fontWeights.medium};
    margin: 0 0 0.3em;
  }

  p img {
    max-width: 100%;
  }
`;

export const ImageWrapper = styled.div`
  margin-bottom: 30px;
  
  & + p {
    margin-bottom: 30px;
  }
`;

export const ImageWrapperVertical = styled.div`
  height: 100%;
  margin-bottom: 30px;
  text-align: center;
  vertical-align: middle;
`;
