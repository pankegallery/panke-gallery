import React, { useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import ColorSwap from "../components/color-swap";
import Footer from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ThemeProvider, ThemeContext } from "../contexts/ThemeContext";
import { theme } from "../theme/theme";
import { GlobalStyles } from "../theme/GlobalStyles";
import { Container, PageWrapper, Main } from "./layout/Layout.styles";
import { OffCanvas } from "./navigation/Navigation.styles";
import { ToggleMenuButton } from "./header/Header.styles";
import Header from "./header";
import Navigation from "./navigation";

/**
 * Page frame: theme providers, global styles, header, off-canvas menu and
 * footer around the page content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content.
 * @param {boolean} [props.wide] - Use `container.maxWidthWide` from
 *   `breakpoints.xl` up, for pages built on the 4-column grid.
 */
const Layout = ({ children, wide }) => {
  const [offCanvas, setOffCanvas] = useState(false);

  const handleClick = () => {
    setOffCanvas((prevOffCanvas) => !prevOffCanvas);
  };

  const offCanvasClass = `${offCanvas ? "active" : ""}`;

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ color, changeThemeColor }) => (
          <StyledThemeProvider theme={theme}>
            <GlobalStyles />
            <PageWrapper>
              <OffCanvas className={offCanvasClass}>
                <ToggleMenuButton
                  className="toggle-menu justify-right"
                  onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faPlus} aria-label="Toggle menu" />
                </ToggleMenuButton>
                <Navigation />
              </OffCanvas>
              <Container className={offCanvas ? "menu-active" : ""} $themeColor={color} $wide={wide}>
                <Header handleClick={handleClick} />
                <Main>{children}</Main>
                <Footer />
              </Container>
              <ColorSwap
                themeColor={color}
                changeThemeColor={changeThemeColor}
              />
            </PageWrapper>
          </StyledThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
};

export default Layout;
