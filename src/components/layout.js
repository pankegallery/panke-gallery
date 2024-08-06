import React, { useState } from "react";
import Helmet from "react-helmet";
import ColorSwap from "../components/color-swap";
import Footer from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../styles/panke.scss";
import { ThemeProvider, ThemeContext } from "../contexts/ThemeContext";
import Header from "./header";
import Navigation from "./navigation";

const Layout = ({ children, redirectActive }) => {
  const [offCanvas, setOffCanvas] = useState(false);

  const handleClick = () => {
    setOffCanvas((prevOffCanvas) => !prevOffCanvas);
  };

  const offCanvasClass = `off-canvas ${offCanvas ? "active" : ""}`;

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ color, changeThemeColor }) => (
          <div className="pageWrapper">
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
              <div className={offCanvasClass}>
                <button
                  className="toggle-menu justify-right"
                  onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faPlus} aria-label="Toggle menu" />
                </button>
                <Navigation />
              </div>
            )}
            <div className={`container theme-${color}`}>
              {!redirectActive && <Header handleClick={handleClick} />}
              <main>{children}</main>
              {!redirectActive && <Footer />}
            </div>
            {!redirectActive && (
              <ColorSwap
                themeColor={color}
                changeThemeColor={changeThemeColor}
              />
            )}
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
};

export default Layout;
