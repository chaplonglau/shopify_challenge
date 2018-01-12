$(document).ready(function(){
  pullData()

});



all_data=[]

function getData(url,data_file){
  $.getJSON(url,function(data){
    data_file.concat(data.menus) 
    console.log(data_file)
    return data_file
  })
}

function pullData(){
  url="https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=1&page=1"
  console.log(url)
  $.getJSON(url,function(data){
    all_data=data.menus
    console.log(hi)
    while (data.pagination.current_page * data.pagination.per_page < data.pagination.total){
      url=url.substring(0,url.length-1)+`${data.pagination.current_page+1}`
      all_data=getData(url,all_data)
    }
  })
}


function dotdata(){
  url="https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=1&page=1"
  $.getJSON(url,function(data){

    answer = 
      {
      "valid_menus": [
        // { "root_id": 2, "children": [4, 6] },
      ],
      "invalid_menus": [
        // { "root_id": 1, "children": [1, 3, 5] }
      ]
    }

    var mySet= new Set()
    for (var menu in data.menus){
      console.log(menu)
      if ('parent_id' in data.menus[menu]){
        //this is a child node. skip
        continue;
      }
      else {
        //this is a parent node
        dps(mySet,menu,data)
      }
    }

  })
}


function dps(set,current_menu,data){
  if (set.has(current_menu.id)){
    //this is a cycle
  }
  else {
     set.add(data.menus[current_menu].id)
     if (data.menus[current_menu].child_ids.length !== 0){
        dps(set,data.menus[current_menu].child_ids[0]-1,data)
     }
     else {
        //this is not a cycle
       answer["valid_menus"].push({"root_id": [...set][0], "children": [...set].shift()})
     }
  }
}