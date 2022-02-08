import React from 'react';
//import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from "../components/layout"
import YoutubePlaylist from "../components/youtubePlaylist"

import {TwitchPlayer} from 'react-twitch-embed';
import YouTube from 'react-youtube';
//import YouTubePlaylist from 'react-youtube-playlist';
//import 'react-youtube-playlist/dist/styles'

class PankeStreaming extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      streaming: true,
      video: undefined
    };
    this.ref = React.createRef();
  }

  replaceVideoScreen = (videoId) => {
//    console.log('Update Video')

    this.setState({
      video: videoId,
      streaming: false
    })

    console.log('ref', this.ref)
    this.ref.current.scrollIntoView();
    return(null)
  }

  renderMainPlayer = () => {
    if (this.state.streaming) {
      return(
        <TwitchPlayer
          channel="pankegallery"
          theme="light"
          width="100%"
        />
      )
    }
    else{
      const videoOptions = {
        width: '100%',
        height: 'auto'
      }
      return(
        <YouTube
          videoId={this.state.video}
          className="video-player"
          containerClassName="responsive-video"
          opts={videoOptions}
        />
      )
    }
  }


  render() {
    const mainPlayer = this.renderMainPlayer();
    return(
      <Layout>
        <Helmet
          title="Streaming"
          meta={[
            {
              name: 'description',
              content: 'Livestream and more video material from panke.gallery. Join us anytime, from  anywhere.'
            }
          ]}
        />

        <section className="streaming twitch">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2 ref={this.ref}>panke.gallery Live</h2>
            </div>
          </div>
          <div className="row main-player">
            <div className="col">
              {mainPlayer}
            </div>
          </div>
        </section>

        <section className="videos further">

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

        </section>
      </Layout>
    );
  }
}

export default PankeStreaming;
