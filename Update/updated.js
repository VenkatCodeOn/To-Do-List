//console.log("Linkked")
document.addEventListener("click",function(e){

    //For Update
    if(e.target.classList.contains("edit-me")){
      let res=  prompt("Enter the New Value",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    axios.post('/update-item',{text:res,id:e.target.getAttribute("data-id")}).then(function(){
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=res
        console.log("Working Fine")
    }).catch(function(){
        console.log("Error. Please Try again")
    })
    }
    //For Delete
    if(e.target.classList.contains("delete-me")){
        confirm("Do yout want to delete it ")
      axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(function(){
          e.target.parentElement.parentElement.remove()
      }).catch(function(){
          console.log("Error.Please Try again")
      })
      }


})