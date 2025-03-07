import { useState } from "react";

import icoCopy from "../../../assets/icons/copy.svg";
import icoClose from "../../../assets/icons/close.svg";
import icoTrash from "../../../assets/icons/trash.svg";
import icoEdit from "../../../assets/icons/edit.svg";
import icoLock from "../../../assets/icons/lock.svg";
import icoLockOpen from "../../../assets/icons/lock-open.svg";

import { WEB_URL } from "../../../CONSTANTS";

export default function Invitation({
  jwt,
  id,
  createdAt,
  updatedAt,
  users,
  ...props
}){
  

  function handleCopy(){

    const singleUserText = `Benvolgut/da ${users[0].name.split(' ')[0]},

Esteu convidat/da al nostre casament. Us agrairíem que confirméssiu la vostra assistència a través del següent enllaç:

${[WEB_URL, 'convidat', id].join('/')}

Moltes gràcies i esperem veure-us aviat.

Amb afecte,
[Els nuvis]`;


const multipleUsersText = `Benvolgut/da ${users[0].name.split(' ')[0]} i acompanyants,

Esteu convidats/des (${users.length} persones) al nostre casament. Us agrairíem que confirméssiu la vostra assistència a través del següent enllaç:

${[WEB_URL, 'convidat', id].join('/')}

Moltes gràcies i esperem veure-us aviat.

Amb afecte,
[Els nuvis]`;

    const text = users.length === 1 ? singleUserText : multipleUsersText;
  
    navigator.clipboard.writeText(text)
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="Invitation">
      <div className={"invitation-main"+ (!isOpen?" pointer":"")} onClick={()=>setIsOpen(!isOpen)}>
        { !isOpen && <div className="invitation-row">
          <span>{users[0].name}
          {
            users.length > 1 && <b>+{users.length-1}</b>
          }
          </span>
          
        </div>}
        {
          isOpen && <div className="invitation-details">
            {
              users.map((u,i)=><div key={i} className="invitation-row-gap">
                <span>{u.name}</span>
                <span>
                  {u.confirmed === true && "Confirmat"}
                  {u.confirmed === false && "Cancel·lat"}
                  {u.confirmed === null && "Pendent"}
                </span>
                <div className="actions">
                  <button>
                    <img src={icoEdit} alt="" />
                  </button>
                  <button>
                    <img src={u.blocked? icoLock : icoLockOpen} alt="" />
                  </button>
                  <button>
                    <img src={icoTrash} alt="" />
                  </button>
                </div>
              </div>)
            }
          </div>
        }
      </div>
      <div className="invitation-actions">
        {
          !isOpen && <>
            <button onClick={handleCopy}> 
              <img src={icoCopy} alt="" />
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
  );
}