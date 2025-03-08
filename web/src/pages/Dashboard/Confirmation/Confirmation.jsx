import { useNavigate, useParams } from 'react-router-dom';
import './Confirmation.css';
import { InputText } from '../../../elio-react-components/components/inputs/InputText/InputText';
import { use, useEffect, useState } from 'react';
import { callApi } from '../../../api/api';
import { groupBySingle, toTitleCase } from '../../../elio-react-components/utils/utils';
import IcoEdit from "../../../assets/icons/edit.svg?react"
import IcoCheck from "../../../assets/icons/check.svg?react"
import IcoCancel from "../../../assets/icons/close.svg?react"
import { TextModal } from '../../../elio-react-components/components/Modals/TextModal/TextModal';
import { InputSelect } from '../../../elio-react-components/components/inputs/InputSelect/InputSelect';
import { getErrMsgFromResp } from '../../../elio-react-components/utils/apiError';

import icoArrow from "../../../assets/icons/arrow-down.svg"
export default function Confirmation({...props}) {


  const { invitationCode } = useParams(); // Get the parameter from URL
  const navigate = useNavigate();

  const [inpCode, setInpCode] = useState("");
  const [assistants, setAssistants] = useState([]);
  const [total, setTotal] = useState(0)
  const [errCode,setErrCode] = useState(null)
  const [menus, setMenus] = useState([])
  const [mine, setMine] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [isEditingMenu, setIsEditingMenu] = useState(null)
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


  async function handleConfirmUser(confirmed,{id,code}){
    const response = await callApi("/update-mine",{id,code,confirmed})
    handleMerge(response.data)
  }

  async function handleEditName({id,code}){
    const response = await callApi("/update-mine",{id,code,name:isEditing.name})
    handleMerge(response.data)
    setIsEditing(false)
  }

  async function handleEditMenu(menu_id,{id,code}){
    const response = await callApi("/update-mine",{id,code,menu_id})
    handleMerge(response.data)
    setIsEditingMenu(false)
  }


  function handleMerge(updatedUser){
    setMine(prev => {
      return prev.map(x => x.id === updatedUser.id ? {...x,...updatedUser} : x);
    })
    fetchAssistants()
  }



  return (
    <>

      <section className='ConfirmationWrapper' {...props}>
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
                    const isConfirmed = confirmed === true
                    const isDenied = confirmed === false
                    const isEditingMe = isEditing && isEditing.id === id
                    const isEditingMyMenu = isEditingMenu  &&  isEditingMenu.id === id
                    const menu = menu_id && menus[menu_id]
                    return(
                  <li key={id}>

                    <div className='rowName row'>
                      <div className='row'>
                        {
                          (!name_locked && !leader) && (
                            isEditingMe?
                            <>
                              <button className='edit green' onClick={()=>handleEditName(user)}><IcoCheck/></button>
                              <button className='edit red' onClick={()=>setIsEditing(null)}><IcoCancel/></button>
                            </>
                            :
                            <button className='edit' onClick={()=>setIsEditing(user)}><IcoEdit/></button>
                          )
                        }
                        <span className='name'>
                          {isEditingMe ?
                            <InputText
                              autoFocus 
                              value={isEditing.name} 
                              onChange={e=>setIsEditing({...isEditing,name:toTitleCase(e.target.value)})} 
                              placeholder="Nom"
                              error={errUpdate?.fields?.name}
                            />
                            :(name || "?")  
                          }
                        </span>
                      </div>
                      <span>
                        {confirmed === true && <span style={{color:"green"}}>Confirmat</span>}
                        {confirmed === false && <span style={{color:"red"}}>Cancel·lat</span>}
                        {confirmed === null && "Pendent"}
                      </span>
                    </div>

                    <div className='rowConfirm row'>
                      <button className={'button green' + (isConfirmed? " muted":"")} onClick={()=>handleConfirmUser(true,user)}>{isConfirmed ? "Confirmat" : "Confirmar"}</button>
                      <button className={'button red' + (isDenied ? " muted":"")} onClick={()=>handleConfirmUser(false,user)}>{isDenied ? "Cancel·lat" : "Cancel·lar"}</button>
                    </div>

                    <div className='row rowMenu'>
                      {
                        !isEditingMyMenu &&
                        <button className='edit' onClick={()=>setIsEditingMenu(user)}><IcoEdit/></button>
                      }
                      <h3>Menu:</h3>


                        {
                          isEditingMyMenu 
                          ?
                          <InputSelect 
                            value={isEditingMenu.menu_id}
                            onChange={e=>handleEditMenu(e,user)}
                            options={Object.keys(menus)}
                            formatViewOption={x=>menus[x] ? (menus[x]?.emoji + " " + menus[x]?.title + " " + menus[x]?.emoji) : ""}
                          />
                          : menu ?
                          menu.emoji + " " + menu.title + " " + menu.emoji
                          :"Sense menú"
                        }

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
  