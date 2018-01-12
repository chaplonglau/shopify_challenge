$(document).ready(function(){
  pullData()

});



all_data=[]

// function getData(url,data_file){
//   $.getJSON(url,function(data){
//     data_file.concat(data.menus) 
//     console.log(data_file)
//     return data_file
//   })
// }

// function pullData(){
//   url="https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=1&page=1"
//   console.log(url)
//   $.getJSON(url,function(data){
//     all_data=data.menus
//     while (data.pagination.current_page * data.pagination.per_page < data.pagination.total){
//       url=url.substring(0,url.length-1)+`${data.pagination.current_page+1}`
//       all_data=getData(url,all_data)
//     }
//   })
// }


function pullData(){
  url="https://raw.githubusercontent.com/chaplonglau/shopify_challenge/master/challenge.json"
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

    var visitedSet= new Set()
    for (var menu in data.menus){
      if ('parent_id' in data.menus[menu] || visitedSet.has(data.menus[menu].id)){
        //this is a child node or we visited it before skip.
        continue;
      }
      else {
        //this is a parent node
        var mySet= new Set()
        visitedSet=dps(mySet,menu,data,answer)
      }
    }
    json=JSON.stringify(answer)
    debugger
  })
}


function dps(set,current_menu,data,answer){
  if (set.has(data.menus[current_menu].id)){
    //this is a cycle
    answer["invalid_menus"].push({"root_id": [...set][0], "children": [...set]})
    return set
  }
  else {
     set.add(data.menus[current_menu].id)
     if (data.menus[current_menu].child_ids.length === 1 ){
        dps(set,data.menus[current_menu].child_ids[0]-1,data,answer)
     }
     else if (data.menus[current_menu].child_ids.length >= 1 ) {
      data.menus[current_menu].child_ids.forEach((child,index)=>{
         dps(set,data.menus[current_menu].child_ids[index]-1,data,answer)
      })
     }
     else {
        //this is not a cycle
       var set2=[...set]
       set2.shift()
       answer["valid_menus"].push({"root_id": [...set][0], "children": [...set2]})
       debugger
     }
     return set
  }
}