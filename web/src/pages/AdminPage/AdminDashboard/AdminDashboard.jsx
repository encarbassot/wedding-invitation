import { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { callApi } from '../../../api/api';
import Invitation from './Invitation';
  
export default function AdminDashboard({jwt}) {




  const [invitations, setInvitations] = useState([])

  useEffect(()=>{
    fetchData()
  },[])

  async function fetchData(){
    const data = await callApi("/list-admin",{},jwt)
    if(data.success){
      setInvitations(data.data)
      console.log(data.data)
    }
  }


  
  return (
    <div className="AdminDashboard">

      <div className='table-invitations'>
        {
          invitations.map(inv=><Invitation key={inv.id} jwt={jwt} {...inv} />)
        }
      </div>

    </div>
  );
}
  