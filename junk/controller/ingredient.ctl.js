const Ingredient = require('../models/ingredients');
const unirest = require('unirest');
const Profile = require('../models/profiles');

 class JsonArr
 {
   constructor()
   {
      this.arr = [];
      this.toSend = [];
   }
   addBy3Json(js1,js2,js3)
   {
      var temp=[];
      for(let i in js1.meals)
      {
         for(let j in js2.meals)
         {
            if(JSON.stringify(js1.meals[i]) === JSON.stringify(js2.meals[j]))
            {
               temp.push(js2.meals[j]);
            }
         }
      }
      for(let i in js1.meals)
      {
         for(let j in js3.meals)
         {
            if(JSON.stringify(temp[i]) === JSON.stringify(js3.meals[j]))
            {
               this.arr.push(js3.meals[j]);
            }
         }
      }
   }
   addBy2Json(js1,js2)
   {
      for(let i in js1.meals)
      {
         for(let j in js2.meals)
         {
            if(JSON.stringify(js1.meals[i]) === JSON.stringify(js2.meals[j]))
            {
               this.arr.push(js2.meals[j]);
            }
         }
      }
   }

   get getArr()
   {
      return this.arr;
   }
   get getToSend()
   {
      return this.toSend;
   }
 }

    module.exports = {
        getIngredient(req, res){
        Ingredient.find({})
        .then(docs => {
        console.log(docs);
        return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
       },
       getRecipeByIngredient(req,res){
           const {ingredient1 = null ,ingredient2 = null,ingredient3 = null } = req.body;
           //console.log(ingredient1 + ' '+ ingredient2+' ' + ingredient3+' ');

            // "ingredient1" :req.body.ingredient1;
             //"ingredient2" : req.body.ingredient2;
             //"ingredient3" : req.body.ingredient3;
          var newArr = new JsonArr;
         //  var toSend = new Array;
            unirest.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient1}`)
             .end( (result1) =>{
                unirest.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient2}`)
                .end((result2)=>{
                  unirest.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient3}`)
                  .end((result3)=>{
                   var js1 = JSON.parse(`${JSON.stringify(result1.body)}`);
                   var js2= JSON.parse(`${JSON.stringify(result2.body)}`);
                   var js3 = JSON.parse(`${JSON.stringify(result3.body)}`);
                   if(ingredient1 && ingredient2 && ingredient3)
                   {
                      newArr.addBy3Json(js1,js2,js3);
                  }
                  else if(ingredient1 && ingredient2 && !ingredient3)
                  {

                     newArr.addBy2Json(js1,js2);
                  }
                  else if(ingredient1 && !ingredient2 && ingredient3)
                  {
                     newArr.addBy2Json(js1,js3);
                  }
                  else if(!ingredient1 && ingredient2 && ingredient3)
                  {
                     newArr.addBy2Json(js2,js3);
                  }
                  else
                  {
                     res.status(404).json("there is no parameter. please send 2 or 3 parameter");
                     return;
                  }

                   res.json(newArr.getArr);
                  })
                })
       })
     
    },
    getAllInstructionRecipeByName(req,res){
      console.log('hello');

      const {name=null} = req.params;
      console.log('hello');
      unirest.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
      .end( (result1) =>{
         var js1 = JSON.parse(`${JSON.stringify(result1.body)}`);
         console.log(js1);
        res.json(js1.meals); 
      })
    },
    addFavoriteList(req, res, next) {
                    const {favName = null , userName = null} = req.query;
                    Profile.find({userName:userName}.find({myFavorites:{strMeal: favName}},
                     (err, docs)=>{
                        if(docs.length){
                            console.log("The recipe is already exist in the favorites list");
                            res.json("The recipe is already exist in the favorites list");
                        }
                        else{
                     unirest.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${favName}`)
                         .end((result1)=> {
                             var js1 = JSON.parse(`${JSON.stringify(result1.body)}`);

                            var condition = {userName: userName},
                            update = {
                                $push:{
                                myFavorites:{
                                idMeal: js1.meals[0].idMeal,
                                strMeal: js1.meals[0].strMeal,
                                strCatagory: js1.meals[0].strCatagory,
                                strArea: js1.meals[0].strArea,
                                strInstruction: js1.meals[0].strInstruction,
                                strMealThumb: js1.meals[0].strMealThumb,
                                strYoutube: js1.meals[0].strYoutube}}
                            },
                            opts = {multi:true};

                            Profile.updateMany(condition, update, opts,
                               (err) => {
                                   if(err)
                                        console.log(`err: ${err}`);
                                   else {
                                        console.log(`Updated document for: ${userName} profile`);
                                        res.json(`Updated document for: ${userName} profile`);
                                   }
                               } )
                         })
                        }
                        }))
   },
   addProfile(req, res, next) {
      const {gmailAccount = null ,prohibitions = null,userName = null } = req.body;
      Profile.find({gmailAccount: gmailAccount} ,
           (err, docs)=>{
              if(docs.length){
                  console.log("A profile with that gmail account already exist");
                  res.json("A profile with that gmail account already exist");
              }
          else{
      const newProfile = new Profile({
          
          gmailAccount: gmailAccount,
          prohibitions: prohibitions,
          userName: userName,
      });
      newProfile.save(
          (err) => {
              if (err) {
                  console.log(`err:${err}`);
              }
              else {
                  console.log(`saved document: ${newProfile}`);
                  res.json({newProfile});
              }
          }
      )}
      })
   }
}