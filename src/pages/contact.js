import React from 'react';


export default function Contact({
  data
}) {
  return (
    <main>
      <section className="further">  {/* Contact info and opening times*/}
        <div className="row">
          <div className="col-sm-4 col-xs-12">
              <h2>Visit us</h2>
              <address>
                  panke.gallery<br />
                  Gerichtstr. 23, Hof 5<br />
                  13347 Berlin
              </address>

              <h2>Opening hours</h2>

              <h3>During exhibitions</h3>
              <p>Wed, Thu, Fri, Sat 3 pm&thinsp;–&thinsp;7 pm<br />
                and for special events</p>

              <h3>Outside exhibition dates</h3>
              <p>on request, please contact us:<br />
                info [at] panke.gallery<br />
                panke.gallery does not accept unsolicited portfolios</p>
          </div>
          <div className="col-sm-8 col-xs-12">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9705.692702113927!2d13.373449086888234!3d52.54386988291701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5738e3f5827699bf!2sPanke+Culture!5e0!3m2!1sde!2sde!4v1483889418506" width="600" height="350" className="googleMap"></iframe>
          </div>
        </div>
      </section>

      <section className="further">  {/* How to find us */}
        <div className="row">
          <div className="col-sm-4 col-xs-12">
              <h2>How to find us</h2>
          </div>
          <div className="col-sm-8 col-xs-12">
              <h3>Arriving by public transport</h3>
              <p>Should you wish to use public transport, please take one of the following lines to WEDDING.</p>
              <p>Bus: 120, 247, M27 (Nettelbeckplatz), N20 (night bus)</p>
              <p>S-Bahn (suburban train): S41 S42 (Ring Bahn)</p>
              <p>U-Bahn (underground): U6	</p>
              <p>from Wedding Station there is a 3 minutes walk to the Gerichtsstrasse 23 and throughout the impressive backyard system to the panke.gallery</p>
          </div>
        </div>
      </section>

      <section className="further"> { /* Newsletter */}
        <div className="row">
          <div className="col-sm-4 col-xs-12">
              <h2>Newsletter</h2>
          </div>
          <div className="col-sm-8 col-xs-12">
              <div className="ml-form-embed"
                data-account="799921:h3l8i2b2t5"
                data-form="883546:b2j1c9">
              </div>
          </div>
         </div>
      </section>

      <section className="further">  {/* Imprint and disclaimer */}
        <div className="row">
          <div className="col-sm-4 col-xs-12">
              <h2>Impressum<br /></h2>

              <h3>panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.</h3>
              <p>Gerichtstr. 23 · Hof V<br />
                13347 Berlin</p>

              <h3>Redaktionell verantwortl. gem. § 5 TMG</h3>
              <p>Robert Sakrowski</p>

              <h3>Handelsregisternummer</h3>
                <p>VR 30390 B</p>
          </div>
          <div className="col-sm-8 col-xs-12">
              <h4>Limitation of liability for internal content</h4>
              <p>The content of our website has been compiled with meticulous care and to the best of our knowledge. However, we cannot assume any liability for the up-to-dateness, completeness or accuracy of any of the pages.</p>
              <p>Pursuant to section 7, para. 1 of the TMG (Telemediengesetz – Tele Media Act by German law), we as service providers are liable for our own content on these pages in accordance with general laws. However, pursuant to sections 8 to 10 of the TMG, we as service providers are not under obligation to monitor external information provided or stored on our website. Once we have become aware of a specific infringement of the law, we will immediately remove the content in question. Any liability concerning this matter can only be assumed from the point in time at which the infringement becomes known to us.</p>

              <h4>Limitation of liability for external links</h4>
              <p>Our website contains links to the websites of third parties (“external links”). As the content of these websites is not under our control, we cannot assume any liability for such external content. In all cases, the provider of information of the linked websites is liable for the content and accuracy of the information provided. At the point in time when the links were placed, no infringements of the law were recognisable to us. As soon as an infringement of the law becomes known to us, we will immediately remove the link in question.</p>

              <h4>Data protection</h4>
              <p>A visit to our website can result in the storage on our server of information about the access (date, time, page accessed). This does not represent any analysis of personal data (e.g., name, address or e-mail address). If personal data are collected, this only occurs – to the extent possible – with the prior consent of the user of the website. Any forwarding of the data to third parties without the express consent of the user shall not take place.</p>

              <h4>Copyright</h4>
              <p>A visit to our website can result in the storage on our server of information about the access (date, time, page accessed). This does not represent any analysis of personal data (e.g., name, address or e-mail address). If personal data are collected, this only occurs – to the extent possible – with the prior consent of the user of the website. Any forwarding of the data to third parties without the express consent of the user shall not take place.</p>
              <p>We would like to expressly point out that the transmission of data via the Internet (e.g., by e-mail) can offer security vulnerabilities. It is therefore impossible to safeguard the data completely against access by third parties. We cannot assume any liability for damages arising as a result of such security vulnerabilities.</p>
              <p>The use by third parties of all published contact details for the purpose of advertising is expressly excluded. We reserve the right to take legal steps in the case of the unsolicited sending of advertising information; e.g., by means of spam mail.</p>

          </div>
        </div>
      </section>
    </main>
  );
}
