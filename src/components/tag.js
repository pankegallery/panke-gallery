import React from 'react';

class Tag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isToggleOn: false};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.tag.slug);
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
    this.refs.tag.classList.toggle('tag-selected');
  }

  render() {
    const thistag = this.props.tag;
    var type = this.props.type;

    if (type == 'eventSeries'){
      var className = 'tag eventSeries';
    }
    else{
      var className = 'tag';
    }

    return (
      <p ref="tag" className ={className} onClick={this.handleClick}>
        {thistag.name}
      </p>
    );
  }
}

export default Tag;
