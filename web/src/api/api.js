
import axios from "axios";
import { API_URL } from "../CONSTANTS";

export async function callApi(url,params,token,method="POST",headers={},more={}){
  const headers2 = token ? { Authorization: `Bearer ${token}`, ...headers} : {...headers}
  // const headers2 = token ? { Authorization: `Bearer ${token}`} : {}

  try{
    const fullUrl = `${API_URL}${url}`

    let response
    if(method==="POST"){
      response = await axios.post(fullUrl,params,{headers:headers2,...more})
    }else if(method === "GET"){
      response = await axios.get(fullUrl, {
        headers: headers2,
        params: params,
        ...more,
      });    
    }

    if(response.data){
      return response.data
    }
  }catch(err){
    if(err.response)
      return {...err.response.data, success:false}
    
    return undefined
  }


}