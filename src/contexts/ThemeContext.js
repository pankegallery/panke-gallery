import React from 'react';

export const ThemeContext = React.createContext();

export class ThemeProvider extends React.Component {
  state = {
    color: 'blue'
  }

  changeThemeColor = (c) => {
    localStorage.setItem("themeColor", JSON.stringify(c))
    this.setState( {
      color: c
    });
//    console.log(c);
  }

  componentDidMount() {
    // Getting theme color  value from localStorage!
    const themeColor = JSON.parse(localStorage.getItem('themeColor'))
    if (themeColor) {
      this.setState( {
        color: themeColor
      });
    }
  }

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          changeThemeColor: this.changeThemeColor
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}



//const defaultState = {
//  color: blue,
//  changeThemeColor: () => {},
//};

//const ThemeContext = React.createContext(defaultState);
///

//class ThemeProvider extends React.Component {
//  state = {
//    color: 'blue'
//  }
//
////  changeThemeColor = (c) => {
////    let color = c;
////    localStorage.setItem("color", JSON.stringify(color))
////    this.setState({ color })
////  }
//
//  componentDidMount() {
//    // Getting dark mode value from localStorage!
//    const themeColor = JSON.parse(localStorage.getItem('color'))
//    if (themeColor) {
//      this.setState({ color: themeColor })
//    }
//  }
//
//  render() {
//    const { children } = this.props
//    const { themeColor } = this.state
//    return (
//      <ThemeContext.Provider
//        value={themeColor}
//      >
//        {children}
//      </ThemeContext.Provider>
//    )
//  }
//}

//export default ThemeContext;
//export { ThemeProvider };
