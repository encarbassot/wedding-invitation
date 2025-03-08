import { useNavigate, useParams } from 'react-router-dom';
import './Confirmation.css';
import { InputText } from '../../../elio-react-components/components/inputs/InputText/InputText';
import { use, useEffect, useState } from 'react';
import { callApi } from '../../../api/api';
import { groupBySingle } from '../../../elio-react-components/utils/utils';
import icoEdit from "../../../assets/icons/edit.svg"
import { TextModal } from '../../../elio-react-components/components/Modals/TextModal/TextModal';
import { InputSelect } from '../../../elio-react-components/components/inputs/InputSelect/InputSelect';
import { getErrMsgFromResp } from '../../../elio-react-components/utils/apiError';

import icoArrow from "../../../assets/icons/arrow-down.svg"
export default function Confirmation() {


  const { invitationCode } = useParams(); // Get the parameter from URL
  const navigate = useNavigate();

  const [inpCode, setInpCode] = useState("");
  const [assistants, setAssistants] = useState([]);
  const [total, setTotal] = useState(0)
  const [errCode,setErrCode] = useState(null)
  const [menus, setMenus] = useState([])
  const [mine, setMine] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [errUpdate, setErrUpdate] = useState({})
  const [showMore, setShowMore] = useState(false)

  useEffect(()=>{
    fetchAssistants()
    fetchMenus()
  },[])

  useEffect(()=>{
    if(invitationCode) fetchMine()
  },[invitationCode])


  async function fetchMine(){
    const response = await callApi("/list-mine",{
      code: invitationCode
    })
    console.log(response)
    if(response.success){
      setMine(response.data)
      setAssistants(prev => {
        return [...prev].sort((a, b) => {
          // If `a` is in `mine`, move it to the top
          const isAInMine = response.data.some(x => x.name === a.name);
          const isBInMine = response.data.some(x => x.name === b.name);
      
          if (isAInMine && !isBInMine) return -1; // Move `a` up
          if (!isAInMine && isBInMine) return 1;  // Move `b` up
      
          // Otherwise, keep the original order from response.data
          return response.data.findIndex(x => x.name === a.name) - 
                 response.data.findIndex(x => x.name === b.name);
        });
      });
    }else{
      setErrCode("No s'ha trobat el codi")
      setInpCode("")
      setMine([])
    }
  }

  useEffect(()=>{
    setErrUpdate({})
  },[isEditing])


  async function fetchAssistants(){
    const response = await callApi("/list")
    console.log(response)
    setTotal(response.data.total)
    setAssistants(response.data.assistants)
    
  }

  async function fetchMenus(){
    const response = await callApi("/menus/list")
    console.log(response)
    setMenus(groupBySingle(response.data,x=>x.id))
  }

  function handleConfirmCode(){
    setErrCode(null)
    navigate(`/convidat/${inpCode}`)
  }

  async function handleConfirmEdit(){
    const {id,name,confirmed,menu_id,code} = isEditing
    const response = await callApi("/update-mine",{id,code,name,confirmed,menu_id})
    console.log(response)
    if(!response.success){
      console.log("ERROR",getErrMsgFromResp(response))
      setErrUpdate(getErrMsgFromResp(response))
    }else{
      const updatedUser = response.data
      setMine(prev => {
        return prev.map(x => x.id === updatedUser.id ? {...x,...updatedUser} : x);
      })
      setIsEditing(null)
      fetchAssistants()
    }
  }

  return (
    <>
      {
        isEditing &&
        <TextModal
          title="Edita la teva invitació"
          setIsOpen={()=>setIsEditing(null)}
          cancelar={()=>setIsEditing(null)}
          aceptar={handleConfirmEdit}
        >
          {
            isEditing.name_locked ?
            <b>{isEditing.name}</b>
            :<InputText 
              title="Nom"
              autoFocus 
              value={isEditing.name} 
              onChange={e=>setIsEditing({...isEditing,name:e.target.value})} 
              placeholder="Nom"
              error={errUpdate?.fields?.name}
            />
          }

          <InputSelect
            title="Confirmat"
            value={isEditing.confirmed}
            onChange={e=>setIsEditing({...isEditing,confirmed:e})}
            options={[true,false,null]}
            formatViewOption={x=>x===true?"Confirmat":x===false?"Cancel·lat":"Pendent"}
            error={errUpdate?.fields?.confirmed}
          />

          <InputSelect
            title={"Menú"}
            value={isEditing.menu_id}
            onChange={e=>setIsEditing({...isEditing,menu_id:e})}
            options={Object.keys(menus)}
            formatViewOption={x=>menus[x] ? (menus[x]?.emoji + " " + menus[x]?.title) : ""}
            error={errUpdate?.fields?.menu_id}
          />

          <br />
          <br />
          <br />
          <br />
          <br />
          
        </TextModal>
      }
      <section className='ConfirmationWrapper'>
        <article className="Confirmation">
          {(invitationCode && !errCode) && <p>Invitation Code: <strong>{invitationCode}</strong></p>}
          {(!invitationCode || errCode) ?
            <div className='noCode'>
              <div>
                <h2>Confirma la teva assistència</h2>
                <p>Introdueix el teu codi d'invitació</p>
              </div>
              <InputText error={errCode} value={inpCode} onChange={e=>setInpCode(e.target.value.toUpperCase())} placeholder="ABC123" onEnter={handleConfirmCode}/>
              <button className='button' onClick={handleConfirmCode}>Confirmar</button>
            </div>
          :
            <div className='confirmed'>
              <h2>La meva invitació</h2>
              {
                mine &&
                <ul>
                  {mine.map((user)=>{
                    const {id,name,leader,name_locked,menu_id,confirmed} = user
                    return(
                  <li key={id} onClick={()=>setIsEditing(user)}>
                    <span>{name || "?"}</span>
                    <div className='right'>

                      <span>
                        {confirmed === true && <span style={{color:"green"}}>Confirmat</span>}
                        {confirmed === false && <span style={{color:"red"}}>Cancel·lat</span>}
                        {confirmed === null && "Pendent"}
                      </span>
                      
                      <span>
                        {menu_id && menus[menu_id]?.emoji || "?"}
                      </span>
                      <span>
                        {menu_id && menus[menu_id]?.title || ""}
                      </span>
                      <img className="edit" src={icoEdit} alt="" />
                    </div>
                  </li>)})}
                </ul>
              }
            </div>
          }
        </article>
        
        <article className={'confirmedPeopleArticle' + ((assistants.length>7 && !showMore)  ? " heightControl":"")}>
          <h2>Personal confirmat</h2>
          <p><b>{assistants.length} persones de {total} confirmades</b></p>
          <br />
          <ul className='confirmedPeople'>
            {assistants.map((assistant,i)=>
              <li key={i}>
                <span>{assistant.name || "?"}</span>
                <div className='right'>
                  <span>
                    {assistant.menu_id && menus[assistant.menu_id]?.emoji || "?"}
                  </span>
                  <span>
                    {assistant.menu_id && menus[assistant.menu_id]?.title || ""}
                  </span>
                </div>
              </li>
            )}
            
          </ul>
          <button className='showMore' onClick={()=>setShowMore(true)}>
            <img src={icoArrow} alt="" />
          </button>
        </article>
      </section>
    </>
  );
}
  