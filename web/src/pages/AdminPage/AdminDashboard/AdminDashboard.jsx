import { useState } from 'react';
import './AdminDashboard.css';
import Invitations from './Invitations/Invitations';
import Menus from './Menus/Menus';

  
export default function AdminDashboard({jwt}) {


  const [page,setPage] = useState(0);
  

  return (
    <div className="AdminDashboard">
      
      <div className='tabs'>
        <button className={'button' + (page===0 ? " active":"")} onClick={()=>setPage(0)}>Invitations</button>
        <button className={'button' + (page===1 ? " active":"")} onClick={()=>setPage(1)}>Menus</button>
      </div>
      {
        page === 0 && <Invitations jwt={jwt} />
      }
  
      {
        page === 1 && <Menus jwt={jwt} />
      }

      
    </div>
  );
}
  