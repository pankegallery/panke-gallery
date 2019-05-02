import React from 'react';

class Tag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isToggleOn: false};

    // This binding is necessary to make `this` work in the callback
    this.handleTagClick = this.handleTagClick.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate(){
<<<<<<< HEAD
    if (this.state.isToggleOn != this.props.filterIsOn){
=======
    if (this.state.isToggleOn !== this.props.filterIsOn){
>>>>>>> development
      this.setState(state => ({
        isToggleOn: this.props.filterIsOn
      }));
    }
  }

  handleTagClick() {
    this.props.handleClick(this.props.tag.slug);

    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));

//    this.refs.tag.classList.toggle('tag-selected');
  }

  render() {
    const thistag = this.props.tag;
    const type = this.props.type;
    const toogle = this.state.isToggleOn

    if (type === 'eventSeries' && toogle) {
      var className = 'tag eventSeries tag-selected';
    }
    else if (type === 'eventSeries' && !toogle) {
<<<<<<< HEAD
      var className = 'tag eventSeries';
=======
      className = 'tag eventSeries';
>>>>>>> development
    }
    else{
      className = 'tag';
    }

    return (
<<<<<<< HEAD
      <p ref="tag" className ={className} onClick={this.handleTagClick}>
=======
      <p ref="tag" className={className} onClick={this.handleTagClick}>
>>>>>>> development
        {thistag.name}
      </p>
    );
  }
}

export default Tag;
