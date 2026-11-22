import React from 'react'
import { ColorSwapContainer, ColorBox } from './color-swap/ColorSwap.styles'
import { theme } from '../theme/theme'

const colours = ['red', 'green', 'blue', 'magenta', 'gold', 'tropical']

/**
 * The six boxes that set the site's accent colour. They're real buttons, so
 * Tab reaches them in page order and Enter and Space press them;
 * `aria-pressed` tells screen readers which colour is on.
 *
 * @param {Object} props
 * @param {string} props.themeColor - The current accent colour, a key of
 *   `theme.colors.panke`.
 * @param {Function} props.changeThemeColor - Called with the chosen key.
 */
const ColorSwap = ({ themeColor, changeThemeColor }) => (
  <ColorSwapContainer aria-label="Accent colour">
    {colours.map(c => (
      <ColorBox
        key={c}
        type="button"
        aria-label={c.charAt(0).toUpperCase() + c.slice(1)}
        aria-pressed={c === themeColor}
        $color={theme.colors.panke[c]}
        onClick={() => changeThemeColor(c)}
      />
    ))}
  </ColorSwapContainer>
)

export default ColorSwap
