import React from 'react'

class PankeColorSwap extends React.Component{
  render(){
    return(

      <div id="color-swap">
        <div className='red'      onClick={() => this.props.changeThemeColor('red'      )}  />
        <div className='green'    onClick={() => this.props.changeThemeColor('green'    )}  />
        <div className='blue'     onClick={() => this.props.changeThemeColor('blue'     )}  />
        <div className='magenta'  onClick={() => this.props.changeThemeColor('magenta'  )}  />
        <div className='gold'     onClick={() => this.props.changeThemeColor('gold'     )}  />
        <div className='tropical' onClick={() => this.props.changeThemeColor('tropical' )}  />
      </div>

    );
  }
}

export default PankeColorSwap;
