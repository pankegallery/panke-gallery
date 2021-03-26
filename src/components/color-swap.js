import React from 'react'

const colours = [
  'red',
  'green',
  'blue',
  'magenta',
  'gold',
  'tropical'
]

class PankeColorSwap extends React.Component{

  render(){
    return(
      <div id="color-swap">
        {colours.map((c, key) => (
          <div
            role="button"
            tabIndex={key}
            aria-label={`Change color to ${c}`}
            className={c}
            key={key}
            onClick={() => this.props.changeThemeColor(c)}
            onKeyDown={() => this.props.changeThemeColor(c)}
          />
        ))}
      </div>
    );
  }
}

export default PankeColorSwap;
