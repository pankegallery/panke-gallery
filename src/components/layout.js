import React, { useState } from "react";
import Helmet from "react-helmet";
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

const Layout = ({ children, redirectActive }) => {
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
              <Helmet
                titleTemplate="%s · panke.gallery"
                title="Home"
                meta={[
                  {
                    name: "description",
                    content:
                      "panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.",
                  },
                  {
                    name: "keywords",
                    content:
                      "net art, Netzkunst, Galerlie, gallery, Berlin, Wedding, Sakrowski, transmediale, Kultur",
                  },
                  {
                    name: "author",
                    content:
                      "panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.",
                  },
                ]}
              />
              <Helmet>
                {/* Favicons for all platforms */}
                <link
                  rel="apple-touch-icon"
                  sizes="180x180"
                  href="/favicons/apple-touch-icon.png"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="32x32"
                  href="/favicons/favicon-32x32.png"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="16x16"
                  href="/favicons/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicons/site.webmanifest" />
                <link
                  rel="mask-icon"
                  href="/favicons/safari-pinned-tab.svg"
                  color="#5bbad5"
                />
                <link rel="shortcut icon" href="/favicons/favicon.ico" />
                <meta name="msapplication-TileColor" content="#2b5797" />
                <meta
                  name="msapplication-config"
                  content="/favicons/browserconfig.xml"
                />
                <meta name="theme-color" content="#ffffff" />
                {/* CDN Scripts for Slideshow, Icons */}
                <script
                  src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                  type="text/javascript"
                />
                <script
                  src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
                  type="text/javascript"
                />
                <link
                  rel="stylesheet"
                  href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
                  type="text/css"
                />
              </Helmet>
              {!redirectActive && (
                <OffCanvas className={offCanvasClass}>
                  <ToggleMenuButton
                    className="toggle-menu justify-right"
                    onClick={handleClick}
                  >
                    <FontAwesomeIcon icon={faPlus} aria-label="Toggle menu" />
                  </ToggleMenuButton>
                  <Navigation />
                </OffCanvas>
              )}
              <Container className={offCanvas ? "menu-active" : ""} $themeColor={color}>
                {!redirectActive && <Header handleClick={handleClick} />}
                <Main>{children}</Main>
                {!redirectActive && <Footer />}
              </Container>
              {!redirectActive && (
                <ColorSwap
                  themeColor={color}
                  changeThemeColor={changeThemeColor}
                />
              )}
            </PageWrapper>
          </StyledThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
};

export default Layout;
