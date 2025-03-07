




export function getErrMsgFromResp(resp, defaultMsg = "Ha ocurrido un error inesperado.", errorFrom = null){
  let errors = [];

  if (!resp || typeof resp !== "object") {
    return { text: defaultMsg, more: [defaultMsg] };
  }


  // Handle high-priority errors from "more"
  if (resp.err?.more) {
    if (typeof resp.err.more === "string") {
      errors.push({ msg: resp.err.more, priority: 2 });
    } else if (typeof resp.err.more === "object") {

      Object.entries(resp.err.more).forEach(([key, detail]) => {


        if (typeof detail === "string") {
          errors.push({ msg: detail, priority: 2 });
        } else if (typeof detail === "object") {



        }
      });
    }
  }



  if (resp.err?.msg) {
    errors.push({ msg: resp.err.msg, priority: 3 });
  }

  // If no specific errors were found, use the default message
  if (errors.length === 0) {
    errors.push({ msg: defaultMsg, priority: 4 });
  }

    
  errors.sort((a, b) => a.priority - b.priority);

  return {
    text: errors[0].msg,
    more: errors.slice(1).map(e => e.msg),
    all: errors.map(e => e.msg)
  };

}