import React from 'react';

class Tag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isToggleOn: false};

    // This binding is necessary to make `this` work in the callback
    this.handleTagClick = this.handleTagClick.bind(this);
  }

  handleTagClick() {
    console.log('Im in the child handler');
    this.props.handleClick(this.props.tag.slug);
    console.log('Im triggered the parent handler');
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
    console.log('Im changed the child state handler');
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
      <p ref="tag" className ={className} onClick={this.handleTagClick}>
        {thistag.name}{this.state.isToggleOn ? 'ON' : 'OFF'}
      </p>
    );
  }
}

export default Tag;
