import React from 'react';
import Link from 'gatsby-link';

export default function Events({
  data
}) {
  return (
    <main>
      <section className="upcoming">

        <div className="row headline">
          <div className="col-sm-12 col-xs-12">
              <h2>Upcoming events</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-xs-12">
              <article className="news-item">
                <a href="https://netzkunst.berlin">
                  <h3>berlin infrastructure</h3>
                  <p>15:00&thinsp;-&thinsp;17:00 workshop<br />
                  Nadja Buttendorf<br />
                  17:00&thinsp;-&thinsp;19:00 panel<br />
                  Diana MacCarty, Pit Schulz (Moderation: Sakrowski)<br />
                  19:00&thinsp;-&thinsp;21:00 discussion<br />
                  Joachim Blank, tba</p>
                  <p className="meta">27 October 2018</p>
                </a>
              </article>
          </div>
        </div>
      </section>

      <section className="past">

        <div className="row headline">
          <div className="col-sm-12 col-xs-12">
              <h2>Past events</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-xs-12">
              <article className="news-item">
                <a href="https://netzkunst.berlin">
                    <h3>recustructing net art__forever</h3>
                    <p>Discussion with Internationale Stadt Berlin , Sebastian Lüdgert, Eva Grubinger | Lecture by Annet Dekker<br />
                      within the exhibition <em>Berlin, Zentrum der Netzkunst – damals und heute</em></p>
                    <p className="meta">13 October 2018</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/eGames_6">
                    <h3>e-Games – die Kunst des ernsten Spiels – 6</h3></a>
                    <p>Artists Presentation by <a href="http://schaefersimon.de/seiten/works.html"> Simon Sch&auml;fer </a>(GER), <br />
				    Screening: An Alternative Reality: The Football Manager Documentary (2014) by Louis Myles </p>
				    <p className="meta">19 June 2018</p>
            </article>

	        <article className="news-item">
                <a href="event/eGames_5">
                    <h3>eGames - die Kunst des ernsten Spiels – 5 </h3>
                    <p>Artists Presentation by <a href="https://www.rolux.org">Sebastian L&uuml;tgert </a> (a.k.a. Robert Luxemburg)<br />
				    Screening: EMPIRE (2008–2012) by Philip Solomon<br />
                    <a href="https://www.vdb.org/titles/parallel-ii">Parallel II</a> (2014) by  Harun Farocki</p>
                    <p className="meta">11 July 2018 </p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/eGames_4">
                    <h3>eGames - die Kunst des ernsten Spiels – 4 </h3>
                    <p>Artists Presentation by <a href="https://www.truekvlt.com/">Jessica Palmer </a>, <a href="https://www.merleleufgen.com/">Merle Leufgen </a>, <a href="https://www.google.com/search?client=firefox-b&biw=2133&bih=1120&tbm=isch&sa=1&ei=R6s0W6HFJuLD6QSNqI2IBw&q=Brody+Condon&oq=Brody+Condon&gs_l=img.3..0j0i24k1l2.174882.175472.0.175892.3.3.0.0.0.0.169.395.1j2.3.0....0...1c..64.img..0.3.394...0i30k1.0.yom7rBmslw4">Brody Condon</a><br />
				    Screening: <a href="http://www.vdb.org/titles/out-operation-urban-terrain">PS2 Diaries</a> (2005) by  Anne Marie Schleiner (US)</p>
                    <p className="meta">27 June 2018 </p>
                </a>
            </article>


	         <article className="news-item">
                <a href="event/eGames_3">
                    <h3>eGames - die Kunst des ernsten Spiels – 3</h3>
                    <p>Artists Presentation by <a href="http://ritesexperience.com">Rites Network</a> (HU)<br />
					Screening: Frag (2008) by  Mike Pasley  (US)</p>
                    <p className="meta">27 June 2018 </p>
                </a>
            </article>



	         <article className="news-item">
                <a href="event/performancefestival">
                    <h3>4 performances</h3>
                    <p>Max Grau, Nadja Buttendorf, Esben Holk</p>
                    <p className="meta">6, 7, 8 and 10 June 2018 </p>
                </a>
            </article>


            <article className="news-item">
                <a href="event/soundnight05">
                    <h3>Sound Night 5</h3>
                    <p>panke.gallery SOUND NIGHT 05 &mdash; NFNR (Neither Famous Nor Rich) 空 Ku, the Void - Version, Rainer Kohlberger</p>
					<p className="meta">9 June 2018</p>
                </a>
            </article>

	         <article className="news-item">
              <a href="event/eGames_two">
                <h3>eGames - die Kunst des ernsten Spiels – 2</h3>
                    <p>Film screening: Codes of Honor (2011) by  Jon Rafman &mdash; The Space Invaders: In Search of Lost Time (2012) by Jeff Von Ward<br />
                    Artist presentation: Omsk Social Club (UK)
                  </p>
                    <p className="meta">30 May 2018 from 21:00&thinsp;–&thinsp;22.00 | after-party with PS+ Gaming DJ Night (free entry)</p>
                </a>
            </article>

	        <article className="news-item">
                <a href="event/cryptorave">
                    <h3>cryptorave</h3>
                    <p><a href="https://wwwwwwwwwwwwwwwwwwwwww.bitnik.org/">!Mediengruppe Bitnik</a>and <a href="http://punkisdada.com/">Omsk Social Club</a>, <a href="https://www.knoth-renner.com">KNOTH & RENNER</a> and panke.gallery worked together to develop the Crypto Rave framework</p>
                    <p className="meta">09 May 2018 from 21:00&thinsp;–&thinsp;04.00</p>
                </a>
            </article>
			<article className="news-item">
                <a href="event/eGames_one">
                    <h3>eGAMES - die Kunst des ernsten Spiels – 1</h3>
                    <p>Artist Presentations by Eva Grubinger and Aram Barthol | Filmscreening: Gamer Age by Ian Santer and Jonathan Drake</p>
                    <p className="meta">25 April 2018 from 19:00&thinsp;–&thinsp;22.00 | after-party with PS+ Gaming DJ Night</p>
                </a>
            </article>

	        <article className="news-item">
                <a href="event/soundnight04">
                    <h3>Sound Night 4</h3>
                    <p>Lineup:  Monotrail &mdash; itskiny &mdash; RCO &mdash; Ioana Vreme Moser and Klaas H&uuml;bner</p>
                    <p className="meta">31. March 2018 from 22:00&thinsp;–&thinsp;open end</p>
                </a>
            </article>



            <article className="news-item">
                <a href="event/soundnight03">
                    <h3>Sound Night III</h3>
                    <p>Lineup: wilted woman, MOMA, sparkasse.wedding, Blue Stork, DJ Schlucht</p>
                    <p className="meta">03 Feburary 2018 from 22:00&thinsp;–&thinsp;open end</p>
                </a>
            </article>

	        <article className="news-item">
                <a href="event/veryParty">
                    <h3>Much Fame, Very Party</h3>
                    <p>Event in the context of Internet Fame exhibition</p>
                    <p className="meta">20 January 2018 from 19:00&thinsp;–&thinsp;open end</p>
                </a>
            </article>


            <article className="news-item">
                <a href="event/calendarLaunch">
                    <h3>About Us | 2018 calendar launch</h3>
                    <p>Launch of the new calendar edition 2018 by Niko Princen</p>
                    <p className="meta">29 November 2017 from 19:00&thinsp;–&thinsp;22:00</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/soundnight02">
                    <h3>SOUND NIGHT II</h3>
                    <p>Live performances by: Candy Blissett, Robert Lippok, Rattenjunge, Blade Ronny (aka ChiChimini | Mattow)</p>
                    <p className="meta">24 November 2017 from 21:00&thinsp;–&thinsp;open end</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/care">
                    <h3>GUERRES INTIMES == FOSSE AUX MORTS CAR LA VEILLE CEST LA FETE DES MORTS</h3>
                    <p>c a r e ~ a url party. Clusterduck Collective and panke.gallery in context of The Wrong Digital Biennale
                    <br />Lineup: ANTONIA XM, RUI HO, Ship Sket, Mara Oscar Cassiani, S x m b r a b2b Shivo, Fatma Pneumonia, Yung Soft</p>
                    <p className="meta">1 November 2017 from 19:00&thinsp;–&thinsp;open end</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/exstrange">
                    <h3>#exstrange</h3>
                    <p>#exstrange exhibition catalog book launch </p>
                    <p className="meta">10 September 2017 from 11:00&thinsp;–&thinsp;18:00</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/express">
                    <h3>The Internet . Express</h3>
                    <p>launch of the new net-art sculpture by Jonas Lund. The sculpture is based on his work &#x201c;The Internet . Express&#x201d; (2017)</p>
                    <p className="meta">09 September 2017 from 19:00&thinsp;–&thinsp;21:00</p>
                </a>
            </article>

			<article className="news-item">
                <a href="event/LAplaysitself">
                    <h3>"Los Santos Plays Itself"</h3>
                    <p>performance by Sebastian L&uuml;tgert</p>
                    <p className="meta">29 April 2017 from 17:00&thinsp;–&thinsp;21:00 and 06 May 2017 from 17:00&thinsp;–&thinsp;21:00</p>

                </a>
            </article>

            <article className="news-item">
                <a href="event/leisure">
                    <h3>How to Beat Everyone in Your Office at Table Tennis — Talk by Leisure Inc.</h3>
                    <p>with Sebastian Schmieg and Silvio Lorusso</p>
                    <p className="meta">11 May 2017 at 18:00&thinsp;–&thinsp;21:00</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/soundnight01">
                    <h3>panke.gallery · Sound Night I</h3>
                    <p>Live performances by TÕLE, RCO, Jee Young Sim + Sinead Meaney (Gg1 Records) | entry 5€</p>
                    <p className="meta">30 March 2017 from 21:00&thinsp;–&thinsp;open end after opening</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/panel-curation">
                    <h3>Kuratieren als Netzwerktechnik</h3>
                    <p>Panel with Karen Archey, Susanne Jaschko and Holger Friese. Moderation Sakrowski</p>
                    <p className="meta">11 February 2017 at 17:00</p>
                </a>
            </article>

            <article className="news-item">
                <a href="event/annet-dekker">
                    <h3>Net art and the need for an expanded practice of conservation</h3>
                    <p>Lecture by Annet Dekker within the exhibition: <em> Netzkunst im Berlin der 1990er – eine kritische Bestandsaufnahme</em></p>
                    <p className="meta">3 February 2017 at 15:00&thinsp;–&thinsp;17:00</p>
                </a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
    archive: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            path: date(formatString: "Y-MM")
            title: date(formatString: "MMMM Y")
          }
        }
      }
    }
  }
`;
