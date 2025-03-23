import icoMore from "../../assets/icons/more.svg"


export default function Spotify(){
  return <>
    <iframe
    style={{borderRadius:"12px"}} 
    src="https://open.spotify.com/embed/playlist/5L0o9m1iTOBBIAnvvGbluP?utm_source=generator" 
    width="100%" 
    height="352" 
    frameBorder="0" 
    allowFullScreen="" 
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
    loading="lazy"></iframe>
    <a className="addSong" target="_blank" href="https://open.spotify.com/playlist/5L0o9m1iTOBBIAnvvGbluP?si=PX-dMCvaRA6WmLcXx1tVvA&pt=f50f1a3a39e72e851a108f61f00fff08&pi=dtltUGu0Qq-sO">Afegir cançons <img src={icoMore} alt="" /></a>
  </>
}

