import { useEffect, useState } from 'react';
import './Menus.css';
import { callApi } from '../../../../api/api';
import { TextModal } from '../../../../elio-react-components/components/Modals/TextModal/TextModal';
import { InputText } from '../../../../elio-react-components/components/inputs/InputText/InputText';
import EmojiPicker from 'emoji-picker-react';
import EditorComponent from '../../../../elio-react-components/components/Editor/Editor';
import EditorOutput from '../../../../elio-react-components/components/Editor/EditorOutput';
import { ObjectGroupBy } from '../../../../elio-react-components/utils/utils';
  
export default function Menus({jwt}) {

  const [menus, setMenus] = useState([])
  const [isCreatingNew, setIsCreatingNew] = useState(false);


  const [inpTitle, setInpTitle] = useState("")
  const [inpEmoji, setInpEmoji] = useState("🍎")
  const [inpDescription, setInpDescription] = useState(null)

  const [showPicker, setShowPicker] = useState(false);

  const [isEditing, setIsEditing] = useState(null)
  const [menuCount, setMenuCont] = useState({})

  useEffect(()=>{
    fetchData()
    fetchUsers()
  },[])


  async function fetchData(){
    const response = await callApi("/menus/list-admin",{},jwt)
    console.log(JSON.parse(response.data[0].description))
    setMenus(response.data)
  }
  async function fetchUsers(){  
    const data = await callApi("/list-admin",{},jwt)
    if(data.success){
      const menuCount = data.data.reduce((acc, curr) => {
        const menuId = curr.menu_id || "no-menu"; // Handle null/undefined values
        acc[menuId] = (acc[menuId] || 0) + 1;
        return acc;
      }, {});
      setMenuCont(menuCount);
    }

  }


  async function handleCreateNewMenu(){
    if(isEditing){
      const response = await callApi("/menu/update",{id:isEditing.id,title:inpTitle,emoji:inpEmoji,description:JSON.stringify(inpDescription)},jwt)
      setIsEditing(null)
      mergeMenus(response.data)
      return
    }else{
      const response = await callApi("/menu/create",{title:inpTitle,emoji:inpEmoji,description:JSON.stringify(inpDescription)},jwt)
      mergeMenus(response.data)
    }
  }

  const handleEmojiClick = (emojiData) => {
    setInpEmoji(emojiData.emoji);
    setShowPicker(false);
  };


  function handleEdit(menu){
    setIsEditing(menu)
    setInpEmoji(menu.emoji)
    setInpTitle(menu.title)
    
    setInpDescription(JSON.parse(menu.description))
  }


  function mergeMenus(newMenus,isDeletion=false){
    setMenus(prev=>{
      let  updated = [...prev]
      for (const newMenu of newMenus) {
        if (isDeletion) {
          // ✅ Deleting Menus
          updated = updated.filter(menu => menu.id !== newMenu.id);
        } else {
          // ✅ Adding or Updating Menus
          const index = updated.findIndex(menu => menu.id === newMenu.id);
          if (index === -1) {
            updated.push(newMenu);
          } else {
            updated[index] = newMenu;
          }
        }
      }
      return updated;
    })
  }


  async function handleDeleteMenu(){
    const response = await callApi("/menu/delete",{id:isEditing.id},jwt)
    mergeMenus(response.data,true)
    setIsEditing(null)
  }

  return (
    <>

      {
        (isCreatingNew || isEditing) && 
        <TextModal 
          title="Create new menu"
          aceptar={handleCreateNewMenu}
          cancelar={()=>{setIsCreatingNew(false);setIsEditing(null)}}
          setIsOpen={()=>{setIsCreatingNew(false);setIsEditing(null)}}
          buttons={[
            {text:"ELIMINAR",red:true,onClick:handleDeleteMenu}
          ]}
          >
            <div style={{minWidth:"500px",display:"flex",flexDirection:"column",gap:"2rem", alignItems:"center"}}>

              <InputText 
                title="Title"
                value={inpTitle}
                onChange={(e)=>setInpTitle(e.target.value)}
                autoFocus
                placeholder="Menu title"
              />

              <button
                onClick={() => setShowPicker((prev) => !prev)}
                className='button'
                style={{ fontSize: "5rem", padding: "0.5rem 5rem" }}
              >
                {inpEmoji}
              </button>
              {
                showPicker &&
                <EmojiPicker onEmojiClick={handleEmojiClick} defaultCategory="FOOD_DRINK" />
              }
            </div>

            <p style={{width:"100%"}}>Description</p>

            <EditorComponent style={{width:"100%"}} onChange={setInpDescription} data={inpDescription}/>

          </TextModal>
      }
      <div className="Menus">
        {
          menus.map(menu=>(<article key={menu.id} onClick={()=>handleEdit(menu)}>
            <h2>{menu.emoji} {menu.title} {menu.emoji} <small>({menuCount[menu.id]})</small></h2>
            <EditorOutput data={JSON.parse(menu.description)} />
          </article>))
        }
        <button onClick={()=>setIsCreatingNew(true)}><b>+</b></button>
      </div>
    </>
  );
}
  