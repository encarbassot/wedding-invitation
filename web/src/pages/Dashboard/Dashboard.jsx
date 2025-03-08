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



export default function Dashboard() {
  const date = moment("2025-05-17", "YYYY-MM-DD");
  const [menus, setMenus] = useState([]);

  useEffect(()=>{
    fetchManus()
  },[])


  async function fetchManus(){
    const response = await callApi("/menus/list")
    const data = await response.data
    setMenus(data)
  }

  
  return (
    <div className="Dashboard">
      <div className='Dashboard-page'>

        
      <section className="header">
        <div className="overlay"></div> {/* New overlay layer */}
        <div className="header-content">
          <h1>Ens Casem!</h1>
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

        <Confirmation />

        <section data-aos="fade-right" className='time'>
          <div className='time-inner'>
            <h2>Falten</h2>
            <Countdown date={date} />
            <h2>per el gran dia</h2>
          </div>
        </section>

        <section data-aos="fade-right" className='map'>
          <div className='map-inner'>
            <h1>On serà?</h1>
            <a href="https://www.alimarahotel.com/">
              <h2>Hotel Alimara</h2>
            </a>
            <h3>Barcelona</h3>
            <img src="/hotel.jpg" alt="" />
            <br />
            <br />
          </div>

          <HotelMap />
        </section>



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



        <section data-aos="fade-right">
          <h2>Quina musica voldràs ballar?</h2>
          <h3>No prometem res!</h3>
          <Spotify />
        </section>

        <footer>
          powered by <a href="fabrega.cat">fabrega.cat</a>
        </footer>
      </div>

    </div>
  );
}
  