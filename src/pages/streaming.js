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
          <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">
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

          <div className="row">
            <div className="col-md-4 col-sm-12 col-xs-12">
              <h2>panke.gallery talks</h2>
            </div>

            <div className="col-md-8 col-sm-12 col-xs-12">
              <YoutubePlaylist
                playlist_id="PLftbjK2gCCbLQ2QXGuOKylxp9oFQFhIPf"
                replaceVideoScreen={(v) => this.replaceVideoScreen(v)}
              />
            </div>

            <div className="col-md-4 col-sm-12 col-xs-12">
              <h2>More Videos</h2>
            </div>

            <div className="col-md-8 col-sm-12 col-xs-12">
              <YoutubePlaylist
                 playlist_id="PLlE5r1i6nB9tXly_lktvBkvbHSyQ0iHth"
                replaceVideoScreen={(v) => this.replaceVideoScreen(v)}
              />
            </div>

          </div>
        </section>
      </Layout>
    );
  }
}

export default PankeStreaming;
