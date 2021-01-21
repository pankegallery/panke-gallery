import React from 'react'
import Moment from 'moment';

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

//    console.log('data', data);

    this.setState({
      playlistData: data
    })
  }

  componentDidMount(){
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
//    console.log('items', playlistData.items);

    if(playlistData.items){

      return(
        <div className="row">
        {
          playlistData.items.map(({id, snippet ={}}) => {
//          console.log('id', id);
//          console.log('snippet', snippet);
//          console.log('title', snippet.title);
            {/* href={`https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`} */}
          return (
          <div key={id} className="col-md-6 col-sm-6 col-xs-12">
            <a
              onClick={() => this.props.replaceVideoScreen(snippet.resourceId.videoId)}
             >
              <p>
                <img src={snippet.thumbnails.medium.url} alt="" />
              </p>
            </a>
            <h3>{snippet.title}</h3>
            {this.truncateDescription(snippet.description)}
            <p className="meta">{Moment(snippet.publishedAt).format('DD.MM.YYYY')} </p>
          </div>)
        })
        }
        </div>
      );

    }
    else{
      console.log('Playlist loading or loading failed');
      return (
        <p>Loading videos…</p>
      )
    }
  }
}

export default YoutubePlaylist;
