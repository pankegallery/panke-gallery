import React from 'react'
import Moment from 'moment';

import { Row, Col } from './layout/Layout.styles'
import { Meta } from './content/Content.styles'

const YOUTUBE_PLAYLIST_API = process.env.GATSBY_YOUTUBE_URL;
const YOUTUBE_API_KEY = process.env.GATSBY_YOUTUBE_API_KEY;

class YoutubePlaylist extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      playlistData: []
    };
  }

  getPlaylistFromServer = async (playlist_id) => {
//    console.log('url', YOUTUBE_PLAYLIST_API);
    const res = await fetch(`${YOUTUBE_PLAYLIST_API}?part=snippet&maxResults=50&playlistId=${playlist_id}&key=${YOUTUBE_API_KEY}`)
    const data = await res.json();

  //  console.log('data: ', data);

    this.setState({
      playlistData: data
    })
  }

  componentDidMount(){
//    console.log('YOUTUBE_PLAYLIST_API', YOUTUBE_PLAYLIST_API)
    this.getPlaylistFromServer(this.props.playlist_id)
  }

  truncateDescription = (desc) => {
    if (desc !== ''){
      let descShort = desc.substring(0,80)
      descShort = descShort + '…'
      return descShort
    }
    else{
      return(null)
    }
  }


  render(){

    const playlistData = this.state.playlistData;
  //  console.log('items', playlistData.items);

    if(playlistData.items){
      return(
        <Row>
          <Col xs={12} sm={12} md={4}>
            <h2>{this.props.title}</h2>
          </Col>
          <Col xs={12} sm={12} md={8}>
            <Row>
            {
              playlistData.items.map(({id, snippet ={}}) => {
    //          console.log('id', id);
    //          console.log('snippet', snippet);
    //          console.log('title', snippet.title);
                return (
                <Col key={id} xs={12} sm={6} md={6}>
                  <button
                    onClick={() => this.props.replaceVideoScreen(snippet.resourceId.videoId)}
                    onKeyDown={() => this.props.replaceVideoScreen(snippet.resourceId.videoId)}
                    aria-label="Play video"
                   >
                    <p>
                      <img src={snippet.thumbnails.medium.url} alt="" />
                    </p>
                  </button>
                  <h3>{snippet.title}</h3>
                    <p>{this.truncateDescription(snippet.description)}</p>
                  <Meta>{Moment(snippet.publishedAt).format('DD.MM.YYYY')} </Meta>
                </Col>
                )
              })
            }
            </Row>
          </Col>
        </Row>
      );
    }
    else if(playlistData.loading === false){
      return(
        <p>Loading videos…</p>

      );
    }
  }
}

export default YoutubePlaylist;
