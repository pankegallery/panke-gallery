import React, { useEffect, useRef, useState } from "react";
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
 * The off-canvas menu is the navigation on narrow screens, and on wide ones
 * zoomed in far enough. It covers the whole page while it is open, so it
 * behaves like a dialog: it takes the focus when it opens, the page behind it
 * can't be reached with Tab (`inert`), Escape closes it, and the focus goes
 * back to the menu button when it closes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content.
 * @param {boolean} [props.wide] - Use `container.maxWidthWide` from
 *   `breakpoints.xl` up, for pages built on the 4-column grid.
 */
const Layout = ({ children, wide }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  // Only give the focus back after the menu was open, not on page load.
  const wasOpen = useRef(false);

  useEffect(() => {
    if (menuOpen) {
      wasOpen.current = true;
      closeButtonRef.current?.focus();
      const closeOnEscape = (event) => {
        if (event.key === "Escape") setMenuOpen(false);
      };
      document.addEventListener("keydown", closeOnEscape);
      return () => document.removeEventListener("keydown", closeOnEscape);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ color, changeThemeColor }) => (
          <StyledThemeProvider theme={theme}>
            <GlobalStyles />
            <PageWrapper>
              <OffCanvas
                id="off-canvas-menu"
                className={menuOpen ? "active" : ""}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
              >
                <ToggleMenuButton
                  ref={closeButtonRef}
                  type="button"
                  className="toggle-menu justify-right"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </ToggleMenuButton>
                <Navigation />
              </OffCanvas>
              <Container
                className={menuOpen ? "menu-active" : ""}
                inert={menuOpen}
                $themeColor={color}
                $wide={wide}
              >
                <Header
                  menuOpen={menuOpen}
                  onMenuClick={() => setMenuOpen(true)}
                  menuButtonRef={menuButtonRef}
                />
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
