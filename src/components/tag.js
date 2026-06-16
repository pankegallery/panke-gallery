import React from 'react';
import styled from 'styled-components'

const StyledTag = styled.button`
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

class Tag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isToggleOn: false};

    // This binding is necessary to make `this` work in the callback
    this.handleTagClick = this.handleTagClick.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate = () => {
    if (this.state.isToggleOn !== this.props.filterIsOn){
      this.setState(state => ({
        isToggleOn: this.props.filterIsOn
      }));
    }
  }

  handleTagClick = () =>  {
    this.props.handleClick(this.props.tag.slug);

    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));

  //  this.refs.tag.classList.toggle('tag-selected');
  }

  render() {
    const thistag = this.props.tag;
    const type = this.props.type;
    const toogle = this.state.isToggleOn

    if (type === 'eventSeries' && toogle) {
      var className = 'tag eventSeries tag-selected';
    }
    else if (type === 'eventSeries' && !toogle) {
      className = 'tag eventSeries';
    }
    else{
      className = 'tag';
    }

    if (this.props.noClick) {
      return (
        <StyledTag
          ref="tag"
          className={className}
          aria-label={`Tagged with ${thistag.name}`}
          tabindex="-100"
        >
          {thistag.name}
        </StyledTag>
      );
    }
    else{
      return (
        <StyledTag
          ref="tag"
          className={className}
          onClick={this.handleTagClick}
          onKeyDown={this.handleTagClick}
          aria-label={`Tagged with ${thistag.name}`}
          tabindex="-100"
        >
          {thistag.name}
        </StyledTag>
      );
    }


  }
}

export default Tag;
