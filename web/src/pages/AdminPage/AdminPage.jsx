import { useState } from 'react';
import './AdminPage.css';
import { InputPassword } from '../../elio-react-components/components/inputs/InputPassword/InputPassword';
import { callApi } from '../../api/api';
import { getErrMsgFromResp } from '../../utils/error';
import AdminDashboard from './AdminDashboard/AdminDashboard';
  
const TOKEN_KEY = "token-ensCasem"
export default function AdminPage() {


  const [jwt, setJwt] = useState(localStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(){
    const data = await callApi("/login",{password})

    if(data.success){
      localStorage.setItem(TOKEN_KEY,data.data)
      setJwt(data.data)
    }else{
      setError(getErrMsgFromResp(data,"Wrong password").text)
    }
    

  }

  if(!jwt) {
    return (
      <div className="Page AdminPage">
        <h1>Admin</h1>
        <p>Not logged in</p>
        <InputPassword 
          title="Password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          onEnter={handleLogin}
          error={error}
        />
        <button className='button' onClick={handleLogin}>Login</button>
      </div>
    )
  }

  return (
    <div className="Page AdminPage">

      <h1>Admin</h1>
      <p>Logged in</p>

      <AdminDashboard jwt={jwt}/>
      
    </div>
  );
}
  