import icoMore from "../../assets/icons/more.svg"


export default function Spotify(){
  return <>
    <iframe
    style={{borderRadius:"12px"}} 
    src="https://open.spotify.com/embed/playlist/5L0o9m1iTOBBIAnvvGbluP?utm_source=generator" 
    width="100%" 
    height="352" 
    frameBorder="0" 
    allowFullscreen="" 
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
    loading="lazy"></iframe>
    <a className="addSong" target="_blank" href="https://open.spotify.com/playlist/5L0o9m1iTOBBIAnvvGbluP?si=kHoXcwykQAiVEm_Ir6wHxQ&pt=78a29e4d6141deb3e22814b21fe22d64&pi=wEVkyl3qQUm-y">Afegir cançons <img src={icoMore} alt="" /></a>
  </>
}

