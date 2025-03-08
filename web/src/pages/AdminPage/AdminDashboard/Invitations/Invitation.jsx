import { useState } from "react";

import icoCopy from "../../../../assets/icons/copy.svg";
import icoClose from "../../../../assets/icons/close.svg";
import icoTrash from "../../../../assets/icons/trash.svg";
import icoEdit from "../../../../assets/icons/edit.svg";
import icoLock from "../../../../assets/icons/lock.svg";
import icoLockOpen from "../../../../assets/icons/lock-open.svg";

import { WEB_URL } from "../../../../CONSTANTS";
import { TextModal } from "../../../../elio-react-components/components/Modals/TextModal/TextModal";
import { callApi } from "../../../../api/api";
import { InputText } from "../../../../elio-react-components/components/inputs/InputText/InputText";
import { InputSelect } from "../../../../elio-react-components/components/inputs/InputSelect/InputSelect";

export default function Invitation({
  jwt,
  code,
  users:_users = [],
  onCreateUpdate,
  menus,
  ...props
}){
  
  const users = _users.sort((a,b)=>a.leader? -1 : 1)

  const [isOpen, setIsOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmDeleteSingle, setConfirmDeleteSingle] = useState(null)
  const [isEditing, setIsEditing] = useState(null)

  const [inpName, setInpName] = useState("")
  const [inpConfirmed, setInpConfirmed] = useState(null)
  const [inpMenu, setInpMenu] = useState(null)


  async function handleAdd(e){
    const resp = await callApi("/add-to-invitation",{code},jwt)
    onCreateUpdate(resp.data)
  }


  async function handleDeleteAll(users){
    const response = await callApi("/delete",{code},jwt)
    if(response.success){
      onCreateUpdate(response.data.deletion,true)
      setConfirmDelete(null)
    }

  }

  async function handleDeleteSingle(){
    const response = await callApi("/delete",{id:confirmDeleteSingle.id},jwt)
    if(response.success){
      onCreateUpdate(response.data.deletion,true)
      setConfirmDeleteSingle(null)
    }
  }


  async function handleUpdateLock(user){
    const response = await callApi("/update",{id:user.id,name_locked:!user.name_locked},jwt)
    if(response.success){
      onCreateUpdate(response.data)
    }
  }

  async function handleSubmitEdit(){
    const response = await callApi("/update",{id:isEditing.id,name:inpName,confirmed:inpConfirmed,menu_id:inpMenu},jwt)
    if(response.success){
      onCreateUpdate(response.data)
      setIsEditing(null)
    }

  }

  function handleOpenEdit(user){
    setIsEditing(user)
    setInpName(user.name)
    setInpConfirmed(user.confirmed)
    setInpMenu(user.menu)
  }

  console.log("MENUS",menus)

  return (<>
    {
      isEditing && <TextModal
        title="Editar convidat"
        aceptar={handleSubmitEdit}
        cancelar={()=>setIsEditing(null)}
        setIsOpen={()=>setIsEditing(null)}
      >
        <InputText
          title="Nom"
          value={inpName}
          onChange={e=>setInpName(e.target.value)}
          autoFocus
        />

        <InputSelect
          title="Confirmat"
          value={inpConfirmed}
          onChange={setInpConfirmed}
          options={[true,false,null]}
          formatViewOption={x=>x===true?"Confirmat":x===false?"Cancel·lat":"Pendent"}
        />

        <InputSelect
          title={"Menú"}
          value={inpMenu}
          onChange={setInpMenu}
          options={Object.keys(menus)}
          formatViewOption={x=>menus[x] ? (menus[x]?.emoji + " " + menus[x]?.title) : ""}
        />

        <br />
        <br />
        <br />
        <br />
        <br />
      </TextModal>
    }
    {
      confirmDeleteSingle && <TextModal
        title="Confirmar eliminació"
        aceptar={handleDeleteSingle}
        cancelar={()=>setConfirmDeleteSingle(null)}
        setIsOpen={()=>setConfirmDeleteSingle(null)}
        aceptarRed
      >
        Estàs segur que vols eliminar aquest convidat?
        <ul style={{listStyle:"disc"}}>
          <li>{confirmDeleteSingle.name}</li>
        </ul>
      </TextModal>
    }

    {
      confirmDelete && <TextModal
        title="Confirmar eliminació"
        aceptar={handleDeleteAll}
        cancelar={()=>setConfirmDelete(null)}
        setIsOpen={()=>setConfirmDelete(null)}
        aceptarRed
        >
        Estàs segur que vols eliminar tots els convidats d'aquesta invitació?
        <ul style={{listStyle:"disc"}}>
          {confirmDelete.map((u,i)=><li key={i}>{u.name}</li>)}
        </ul>
      </TextModal>
    }

      <div className="Invitation">
        <div className={"invitation-main"+ (!isOpen?" pointer":"")} 
          onClick={(event) => {
            if (!isOpen || event.currentTarget === event.target) {
              setIsOpen(!isOpen);
            }
          }}
        >
          { !isOpen && <div className="invitation-row">
            <span>{users[0].name}
            {
              users.length > 1 && <b>+{users.length-1}</b> 
            }
            </span>

            <div>
              <span style={{color:"green"}}>{users.filter(x=>x.confirmed === true).length}</span>
              -
              <span style={{color:"red"}}>{users.filter(x=>x.confirmed === false).length}</span>
              -
              <span>{users.filter(x=>x.confirmed === null).length}</span>
            </div>
            
          </div>}
          {
            isOpen && <div className="invitation-details">
              {
                users.map((u,i)=><div key={i} className="invitation-row-gap">
                  <span>
                    <span className="fav">
                      {u.leader ? "⭐" :" "}
                    </span>
                    {u.name}
                  </span>
                  <div className="right">
                    <span>
                      {u.confirmed === true && <span style={{color:"green"}}>Confirmat</span>}
                      {u.confirmed === false && <span style={{color:"red"}}>Cancel·lat</span>}
                      {u.confirmed === null && "Pendent"}
                    </span>
                    <span>
                      {u.menu_id && menus[u.menu_id]?.emoji || "?"}
                    </span>
                    <div className="actions">
                      <button onClick={()=>handleOpenEdit(u)}>
                        <img src={icoEdit} alt="" />
                      </button>
                      <button onClick={()=>handleUpdateLock(u)}>
                        <img src={u.name_locked? icoLock : icoLockOpen} alt="" />
                      </button>
                      <button onClick={()=>setConfirmDeleteSingle(u)}>
                        <img src={icoTrash} alt="" />
                      </button>
                    </div>
                  </div>
                </div>)
              }
              <button onClick={handleAdd}><b>+</b></button>
            </div>
          }
        </div>
        <div className="invitation-actions">
          {
            !isOpen && <>
              <button onClick={()=>handleCopy(users)}> 
                <img src={icoCopy} alt="" />
              </button>
              <button onClick={()=>setConfirmDelete(users)}> 
                <img src={icoTrash} alt="" />
              </button>
            </>
          }
          {
            isOpen && <>
              <button onClick={()=>setIsOpen(!isOpen)}>
                <img src={icoClose} alt="" />
              </button>
            </>
          }
        </div>
      </div>
    </>
  );
}


















function handleCopy(users){

  const singleUserText = `Benvolgut/da ${users[0].name.split(' ')[0]},

Esteu convidat/da al nostre casament. Us agrairíem que confirméssiu la vostra assistència a través del següent enllaç:

${[WEB_URL, 'convidat', users[0].code].join('/')}

Moltes gràcies i esperem veure-us aviat.

Amb afecte,
[Els nuvis]`;


const multipleUsersText = `Benvolgut/da ${users[0].name.split(' ')[0]} i acompanyants,

Esteu convidats/des (${users.length} persones) al nostre casament. Us agrairíem que confirméssiu la vostra assistència a través del següent enllaç:

${[WEB_URL, 'convidat', users[0].code].join('/')}

Moltes gràcies i esperem veure-us aviat.

Amb afecte,
[Els nuvis]`;

  const text = users.length === 1 ? singleUserText : multipleUsersText;

  navigator.clipboard.writeText(text)
}