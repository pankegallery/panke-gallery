import React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import { FurtherSection, Headline, ResponsiveVideo } from "../components/content/Content.styles";
import YoutubePlaylist from "../components/youtubePlaylist";

import ReactPlayer from "react-player";

import YouTube from "react-youtube";
import { Section } from "../components/content/Content.styles";

class PankeStreaming extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streaming: true,
      video: undefined,
    };
    this.ref = React.createRef();
  }

  replaceVideoScreen = (videoId) => {
    //    console.log('Update Video')

    this.setState({
      video: videoId,
      streaming: false,
    });

    console.log("ref", this.ref);
    this.ref.current.scrollIntoView();
    return null;
  };

  renderMainPlayer = () => {
    if (this.state.streaming) {
      return (
        <ResponsiveVideo>
          <ReactPlayer
            url="https://www.twitch.tv/pankegallery"
            // width="100%"
            // height="100%"
          />
        </ResponsiveVideo>
        // <TwitchPlayer
        //   channel="pankegallery"
        //   theme="light"
        //   width="100%"
        // />
      );
    } else {
      const videoOptions = {
        width: "100%",
        height: "auto",
      };
      return (
        <YouTube
          videoId={this.state.video}
          className="video-player"
          containerClassName="responsive-video"
          opts={videoOptions}
        />
      );
    }
  };

  render() {
    const mainPlayer = this.renderMainPlayer();
    return (
      <Layout>
        <Helmet
          title="Streaming"
          meta={[
            {
              name: "description",
              content:
                "Livestream and more video material from panke.gallery. Join us anytime, from  anywhere.",
            },
          ]}
        />

        <Section className="streaming info">
          <Headline>
              <h1 ref={this.ref}>panke.gallery Live</h1>
           </Headline>
           {mainPlayer}
        </Section>

        <FurtherSection className="videos">
          <YoutubePlaylist
            title="panke.gallery Talks"
            playlist_id="PLftbjK2gCCbLQ2QXGuOKylxp9oFQFhIPf"
            replaceVideoScreen={(v) => this.replaceVideoScreen(v)}
          />
          <YoutubePlaylist
            title="panke.gallery Performances"
            playlist_id="PLftbjK2gCCbLYlv_Lsl9ONl1Buu8CE5wF"
            replaceVideoScreen={(v) => this.replaceVideoScreen(v)}
          />
         </FurtherSection>
      </Layout>
    );
  }
}

export default PankeStreaming;
