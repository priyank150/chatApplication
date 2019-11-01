var db = require('../database');

var selectOneRow = async function(query='', parameter=[]) {
    if(query!=="" && query!==null){
      try {
          if(parameter && parameter.length>0){
              return  await db.one(query,parameter);
          }else{
              return await db.one(query);
          }
        }
        catch(e) {
          if(e){
            //console.log(e);
            var response = {'status':'error','message':e.message,'query': e.query}
            return response;
          }
        }
    }
  }