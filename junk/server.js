const express = require('express');
const ingredientCtl = require('./controller/ingredient.ctl');
const app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static('./public')); // for API
//app.use(express.json());
//   app.use(
//     (req, res, next) => {
//     //res.header("Access-Control-Allow-Origin", "*");
//     //res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
//     res.set("Content-Type", "application/json");
//     next();
//     });
app.use(express.urlencoded({extended:true}));


/*** All routes ***/
app.get('/ingredients/getAllIngredients', ingredientCtl.getIngredient);
app.get('/recipes', ingredientCtl.getRecipeByIngredient);                           //send 2 or 3 ingredient
app.get('/getInstruction/:name',ingredientCtl.getAllInstructionRecipeByName);       ///getInstruction/${name}
app.get('/addFavorite',ingredientCtl.addFavoriteList);
app.get('/addProfile',ingredientCtl.addProfile);

app.listen(port, () => console.log(`listening on port ${port}`));



