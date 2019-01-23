const Profile = require('../models/profiles');
const axios = require('axios');

module.exports = {
   async addFavoriteList(req, res, next) {
      try {
         const { favName = null, userName = null } = req.body;
         const { data: result1 } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${favName}`)       //check if meal exist in the list of the api
         if (!result1.meals)
            return res.json(`There is no recipe: ${favName}`);

         const docs = await Profile.find({ userName: userName })
         if (!docs.length)
            return res.json(`There is no user name: ${userName}`);

         for (let i in docs[0].myFavorites) {
            if (docs[0].myFavorites[i].strMeal === favName) {
               console.log("The recipe is already exist in the favorites list");
               return res.json("The recipe is already exist in the favorites list");

            }
         }

         let condition = { userName: userName },
            update = {
               $push: {
                  myFavorites: {
                     idMeal: result1.meals[0].idMeal,
                     strMeal: result1.meals[0].strMeal,
                     strCatagory: result1.meals[0].strCatagory,
                     strArea: result1.meals[0].strArea,
                     strInstruction: result1.meals[0].strInstruction,
                     strMealThumb: result1.meals[0].strMealThumb,
                     strYoutube: result1.meals[0].strYoutube
                  }
               }
            },
            opts = { multi: true };

         await Profile.updateMany(condition, update, opts)
         console.log(`Updated document for: ${userName} profile`);
         res.json(`Updated document for: ${userName} profile`);
      } catch (err) { console.error(err) }
   },
   async addProfile(req, res, next) {
      try {
         const { gmailAccount = null, prohibitions = null, userName = null } = req.body;
         if (!gmailAccount || !userName)
            return res.json("userName and gmailAcount required");

         const docs = await Profile.find({ gmailAccount: gmailAccount });
         const docs1 = await Profile.find({ userName: userName });
         if (docs.length) {
            console.log("A profile with that gmail account already exist");
            return res.json("A profile with that gmail account already exist");
         }
         if (docs1.length) {
            console.log("A profile with that user name already exist");
            return res.json("A profile with that user name already exist");
         }
         else {
            const newProfile = new Profile({

               gmailAccount: gmailAccount,
               prohibitions: prohibitions,
               userName: userName,
            });
            await newProfile.save()
            console.log(`saved document: ${newProfile}`);
            res.json({ newProfile });


         }
      } catch (err) { console.error(err) };
   },
   async removeFavoriteList(req, res, next) {
      try {
         const { favName = null, userName = null } = req.body;
         const { data: result1 } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${favName}`)
         if (!result1.meals) {
            console.log(`There is no recipe: ${favName}`);
            return res.json(`There is no recipe: ${favName}`);
         }

         var condition = { userName: userName },
            update = {
               $pull: {
                  myFavorites: {
                     idMeal: result1.meals[0].idMeal,
                     strMeal: result1.meals[0].strMeal,
                     strCatagory: result1.meals[0].strCatagory,
                     strArea: result1.meals[0].strArea,
                     strInstruction: result1.meals[0].strInstruction,
                     strMealThumb: result1.meals[0].strMealThumb,
                     strYoutube: result1.meals[0].strYoutube
                  }
               }
            },
            opts = { multi: true };

         const docs = await Profile.find({ userName: userName })
         if (!docs.length)
            return res.json(`There is no user name: ${userName}`);

         await Profile.updateMany(condition, update, opts);
         console.log(`Updated document for: ${userName} profile`);
         res.json(`Updated document for: ${userName} profile`);
      } catch (err) { console.error(err) };
   },
   async editProfile(req, res, next) {
      try {
         const { gmailAccount = null, userName = null, prohibitions = null } = req.body;
         if(!gmailAccount)
         {
            res.json("Gmail acount required");
            console.log("Gmail acount required");
         }
         const docs = await Profile.find({ gmailAccount: gmailAccount });
         if (!docs.length) {
            console.log("A profile with that gmail account isn't exist");
            return res.json("A profile with that gmail account isn't exist");
         }
         const result  = await Profile.find({ userName: userName });
         if (result.length) {
            console.log("A profile with that user name already exist");
            return res.json("A profile with that user name already exist");
         }
         else {
            await Profile.updateMany(
               { "gmailAccount": gmailAccount },
               { $set: { "userName": userName, "prohibitions": prohibitions } }
            )
            console.log(`${gmailAccount}'s profile updated: \n userName -> ${userName} \n prohibitions -> ${prohibitions}`);
            res.json(`${gmailAccount}'s profile updated: userName -> ${userName}, prohibitions -> ${prohibitions}`);
         }

      } catch (err) { console.error(err) };

   },
}