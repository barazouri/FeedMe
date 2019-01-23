const express = require('express');
const recipeCtl = require('./controller/recipe.ctl');
const profileCtl = require('./controller/profile.ctl');
const gmailAPI = require('./API/gmailAPI')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));


/*** All routes ***/
app.get('/ingredients/getAllIngredients', recipeCtl.getIngredient);
app.get('/recipes', recipeCtl.getRecipeByIngredient);                           //send 2 or 3 ingredient
app.get('/getInstruction/:name',recipeCtl.getAllInstructionRecipeByName);       ///getInstruction/${name}
app.post('/addFavorite',profileCtl.addFavoriteList);
app.post('/addProfile',profileCtl.addProfile);
app.get('/getEmailByGmailAPI',gmailAPI.getUserByGmail);
app.post('/removeFavorite',profileCtl.removeFavoriteList);  
app.post('/editProfile', profileCtl.editProfile);           //edit specific profile: by giving userName update to newUserName, and prohibitions

app.all('*', (req, res)=>{  
    console.log("try: \n http://localhost:3000/ingredients \t to get all ingredients from the list. \n http://localhost:3000/recipes/:ingre \t to get all recipes that include a given ingredient. \n http://localhost:3000/addFavorite \t tp add new favorite by userName and by recipe name and update to specific user- postman- GET- params \n http://localhost:3000/removeFavorite \t to delete recipe from favorite list by userName and recipe name and update specific user - postman- GET- Params \n http://localhost:3000/profileFavorite \t to show all favorites of spesific user- Postman- GET- Params \n http://localhost:3000/addProfile \t to add Profile and check if no duplicates- Postman- GET-Body \n http://localhost:3000/editProfile \t edit specific profile: by giving userName update to newUserName, and prohibitions -Postman- GET-Params \n http://localhost:3000/getInstruction/:name \t get recipe instructions by giving recipe name- URL")                    //works
    res.send('try: \n http://localhost:3000/ingredients \t to get all ingredients from the list. \n http://localhost:3000/recipes/:ingre \t to get all recipes that include a given ingredient. \n http://localhost:3000/addFavorite \t tp add new favorite by userName and by recipe name and update to specific user- postman- GET- params \n http://localhost:3000/removeFavorite \t to delete recipe from favorite list by userName and recipe name and update specific user - postman- GET- Params \n http://localhost:3000/profileFavorite \t to show all favorites of spesific user- Postman- GET- Params \n http://localhost:3000/addProfile \t to add Profile and check if no duplicates- Postman- GET-Body \n http://localhost:3000/editProfile \t edit specific profile: by giving userName update to newUserName, and prohibitions -Postman- GET-Params \n http://localhost:3000/getInstruction/:name \t get recipe instructions by giving recipe name- URL');
  });
app.listen(port, () => console.log(`listening on port ${port}`));



