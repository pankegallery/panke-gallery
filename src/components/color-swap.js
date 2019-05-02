import React from 'react'

class PankeColorSwap extends React.Component{
  render(){
    return(
      <div id="color-swap">
        <div className='red'      onClick={(e) => this.props.handleThemeColorClick(e, 'red'      )}  />
        <div className='green'    onClick={(e) => this.props.handleThemeColorClick(e, 'green'    )}  />
        <div className='blue'     onClick={(e) => this.props.handleThemeColorClick(e, 'blue'     )}  />
        <div className='magenta'  onClick={(e) => this.props.handleThemeColorClick(e, 'magenta'  )}  />
        <div className='gold'     onClick={(e) => this.props.handleThemeColorClick(e, 'gold'     )}  />
        <div className='tropical' onClick={(e) => this.props.handleThemeColorClick(e, 'tropical' )}  />
      </div>
    );
  }
}

export default PankeColorSwap;
