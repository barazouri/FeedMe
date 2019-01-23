const axios = require('axios');

class JsonArr {
    constructor() {
        this.arr = [];
    }
    addBy3Json(js1, js2, js3) {
        let temp = [];
        for (let i in js1.meals) {
            for (let j in js2.meals) {
                if (JSON.stringify(js1.meals[i]) === JSON.stringify(js2.meals[j])) {
                    temp.push(js2.meals[j]);
                }
            }
        }
        for (let i in js1.meals) {
            for (let j in js3.meals) {
                if (JSON.stringify(temp[i]) === JSON.stringify(js3.meals[j])) {
                    this.arr.push(js3.meals[j]);
                }
            }
        }
    }
    addBy2Json(js1, js2) {
        for (let i in js1.meals) {
            for (let j in js2.meals) {
                if (JSON.stringify(js1.meals[i]) === JSON.stringify(js2.meals[j])) {
                    this.arr.push(js2.meals[j]);
                }
            }
        }
    }
    checkHowManyParams(ingredient1, ingredient2, ingredient3, result1, result2, result3) {
        if (ingredient1 && ingredient2 && ingredient3) {
            this.addBy3Json(result1, result2, result3);
        }
        else if (ingredient1 && ingredient2 && !ingredient3) {
            this.addBy2Json(result1, result2);
        }
        else if (ingredient1 && !ingredient2 && ingredient3) {
            this.addBy2Json(result1, result3);
        }
        else if (!ingredient1 && ingredient2 && ingredient3) {
            this.addBy2Json(result2, result3);
        }
        else
            return false;

    }
    async deleteProhebition(toDelete) {
        let indexes = [];
        for (let i in this.arr) {
            try {
                const { data: result1 } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.arr[i].strMeal}`)
                for (let z = 0; z < 20; z++)                                         //check all the ingredient in the ricipe
                {
                    if (result1.meals[0][`strIngredient${z + 1}`] === toDelete) {
                        this.arr.splice(i, 1);                                     //if there is prohebition in the recipe drop this recipe 
                    }
                }
            }
            catch (err) { console.error(err) }
        }
    }


    get getArr() {
        return this.arr;
    }
    get getToSend() {
        return this.toSend;
    }
}

let newArr = new JsonArr;
module.exports = newArr;