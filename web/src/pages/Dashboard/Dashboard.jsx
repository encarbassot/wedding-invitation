import moment from 'moment/moment';

import './Dashboard.css';

import  "moment/locale/es"; 
import  "moment/locale/ca"; 
moment.locale('ca');
// moment.locale('es');

import Countdown from '../../components/Countdown/Countdown';
import Confirmation from './Confirmation/Confirmation';
import HotelMap from './HotelMap';
import { useEffect, useState } from 'react';
import { callApi } from '../../api/api';
import EditorOutput from '../../elio-react-components/components/Editor/EditorOutput';
import Spotify from './Spotify';
import Timeline from '../../components/Timeline/Timeline';



export default function Dashboard() {
  const date = moment("2025-05-17 9:00", "YYYY-MM-DD HH:mm" );
  const [menus, setMenus] = useState([]);

  useEffect(()=>{
    fetchManus()
  },[])


  async function fetchManus(){
    const response = await callApi("/menus/list")
    if(response.success){
      setMenus(response.data)
    }
  }

  
  return (
    <div className="Dashboard">
      <div className='Dashboard-page'>

        
      <section data-aos="fade-down" className="header">
        <img className="imgBackground" src="/flowers.webp" alt="" />
        <div className="overlay"></div> {/* New overlay layer */}
        <div className="header-content">
          <h1>Ens casem !</h1>
          <h2>Laura & Xavi</h2>
          <h3>{date.format("D [de] MMMM [de] YYYY")}</h3>
        </div>
      </section>

      <section data-aos="fade-right" className='video'>
          <div className='video-inner'>
            <video controls>
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video.
            </video>
          </div>
        </section>


        <section data-aos="fade-right" className='time'>
          <div className='time-inner'>
            <h2>Falten</h2>
            <Countdown date={date} />
            <h2>Pel gran dia</h2>
          </div>
        </section>

        <section data-aos="fade-right" className='map'>
          <div className='map-inner'>
            <h1>On serà?</h1>
            <h2>Hotel Alimara</h2>
            <h3>Barcelona</h3>
            <img src="/hotel.webp" alt="" />
            <a href="https://www.alimarahotel.com/" style={{textDecoration:"underline"}}>Més informació sobre l'Hotel Alimara</a>
          </div>

          <HotelMap />
        </section>


        <Timeline data-aos="fade-right" />

        {
          menus.length > 0 &&
          <section data-aos="fade-right" className='menus'>
            
            <h1>Menús</h1>
            <div className='menus-list'>
              {menus.map((menu, index) => (
                <div key={index} className='menu'>
                  <h2>{menu.emoji} {menu.title} {menu.emoji}</h2>
                  <EditorOutput data={JSON.parse(menu.description)} />
                </div>
              ))}
            </div>

          </section>
        }



        <Confirmation data-aos="fade-right"/>



        <section data-aos="fade-right">
          <h2>Quina musica voldràs ballar?</h2>
          <h3>No prometem res!</h3>
          <Spotify />
        </section>

        <section data-aos="fade-right">
          <h1>Regals</h1>
          <h2>Ja tenim Airfraier i Roomba</h2>
          <h2>Amb un bizzum ja fem</h2>
        </section>

        <footer>
          powered by <a href="fabrega.cat">fabrega.cat</a>
        </footer>
      </div>

    </div>
  );
}
  