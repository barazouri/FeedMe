import React from "react";
import './footer.css';

import { TiSocialFacebook } from 'react-icons/ti'
import { TiSocialTwitter } from 'react-icons/ti'
import { TiSocialInstagram } from 'react-icons/ti'
import { GiKnifeFork } from 'react-icons/gi'

const FooterPage = () => {
  return (
      <div className = "footer">
        <div className="footerLeft">
                 <h5 className="title">Find Us</h5>
                 <div className="fork"><GiKnifeFork/></div>
                 <p>
                     find us on FaceBook, Twitter and Instagram
                 </p>
                 <ul>
                         <li className="fb"><TiSocialFacebook/></li>
                         <li className="twit"><TiSocialTwitter/></li>
                         <li className="insta"><TiSocialInstagram/></li>
                     </ul>
             </div>
    <div className="footerRight">
                 <h5 className="title">About us</h5>
                 <div className="fork"><GiKnifeFork/></div>
                 <p>
                     FeedMe the perfect application that makes the best recipe for you 
                 </p>
             </div>
      
      
      </div>
  );
}

export default FooterPage;