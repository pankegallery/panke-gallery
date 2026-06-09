import React from 'react'
import { ColorSwapContainer, ColorBox } from './color-swap/ColorSwap.styles'
import { theme } from '../theme/theme'

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
      <ColorSwapContainer>
        {colours.map((c, key) => (
          <ColorBox
            role="button"
            tabIndex={key}
            aria-label={`Change color to ${c}`}
            $color={theme.colors.panke[c]}
            key={key}
            onClick={() => this.props.changeThemeColor(c)}
            onKeyDown={() => this.props.changeThemeColor(c)}
          />
        ))}
      </ColorSwapContainer>
    );
  }
}

export default PankeColorSwap;
