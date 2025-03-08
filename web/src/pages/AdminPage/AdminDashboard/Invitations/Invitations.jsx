import { useEffect, useState } from 'react';
import './Invitations.css';
import { callApi } from '../../../../api/api';
import Invitation from './Invitation';
import { TextModal } from '../../../../elio-react-components/components/Modals/TextModal/TextModal';
import { InputText } from '../../../../elio-react-components/components/inputs/InputText/InputText';
import { getErrMsgFromResp } from '../../../../elio-react-components/utils/apiError';
import { groupBySingle, ObjectGroupBy } from '../../../../elio-react-components/utils/utils';

  
export default function Invitations({jwt}) {




  const [invitations, setInvitations] = useState({})
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [inpName, setInpName] = useState("")
  const [inpNumber, setInpNumber] = useState("1")
  const [error, setError] = useState({})

  const [menus, setMenus] = useState([])

  useEffect(()=>{
    fetchData()
  },[])

  useEffect(()=>{
    setError(null)
  },[inpName,inpNumber])

  useEffect(()=>{
    setInpName("")
    setInpNumber("1")
  },[isCreatingNew])

  async function fetchData(){
    const data = await callApi("/list-admin",{},jwt)
    if(data.success){
      const newInvitations = ObjectGroupBy(data.data,x=>x.code)
      setInvitations(newInvitations)
      console.log(newInvitations)
    }

    const dataMenus = await callApi("/menus/list-admin",{},jwt)
    if(dataMenus.success){
      setMenus(groupBySingle(dataMenus.data,x=>x.id))
    }
  }


  async function handleAceptar(){
    const response = await callApi("/create-invitation",{name:inpName,number:inpNumber},jwt)
    if(response.success){
      console.log("INSERTION",response)
      handleMerge(response.data)
      setIsCreatingNew(false)
    }else{
      setError(getErrMsgFromResp(response));
    }
  }

  function handleMerge(newInvitations,isDeletion=false){
    setInvitations(prev=>{
      const updated = {...prev}
      for (const newInv of newInvitations) {
        if (isDeletion) {
          // ✅ Deleting Invitations
          if (updated[newInv.code]) {
            updated[newInv.code] = updated[newInv.code].filter(inv => inv.id !== newInv.id);

            // If no invitations left under that code, remove the key
            if (updated[newInv.code].length === 0) {
              delete updated[newInv.code];
            }
          }
        } else {
          // ✅ Adding / Updating Invitations
          if (!updated[newInv.code]) {
            updated[newInv.code] = [newInv]; // New group
          } else {
            const index = updated[newInv.code].findIndex(inv => inv.id === newInv.id);
            if (index === -1) {
              updated[newInv.code] = [...updated[newInv.code], newInv]; // Add new entry
            } else {
              updated[newInv.code] = [...updated[newInv.code]]; // Clone array
              updated[newInv.code][index] = newInv; // Update existing entry
            }
          }
        }
      }
      return updated
    })
  }

  return (<>
    {
      isCreatingNew && 
      <TextModal 
        title="New Invitation" 
        setIsOpen={setIsCreatingNew}
        aceptar={handleAceptar}
      >
        <InputText 
          title="Name"
          value={inpName}
          onChange={e=>setInpName(e.target.value)}
          autoFocus
          placeholder="Pepito Los Palotes"
          error={error?.fields?.name}
        />
        <InputText 
          title="Number"
          value={inpNumber}
          onChange={e=>setInpNumber(e.target.value)}
          typeNumber
          showArrows
          error={error?.fields?.number}
        />
      </TextModal>
    }
    <section className='invitations'>
      <div className='actions '>
        <button className='button' onClick={()=>setIsCreatingNew(true)}>New</button>
      </div>
      <div className='table-invitations'>
        {
          Object.keys(invitations).map(code=><Invitation key={code} jwt={jwt} code={code} users={invitations[code]} onCreateUpdate={handleMerge} menus={menus} />)
        }
      </div>
    </section>
  </>);
}
  