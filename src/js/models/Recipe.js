import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
     async getRecipe() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

            console.log(res);
        }
        catch(error) {
            console.log(error);
            alert("Something went wrong");
        }
    }
    calcTime() {
        const numImg = this.ingredients.length;
        const periods = Math.ceil(numImg/3);
        this.time = periods*15;
    }
    calServings() {
        this.servings = 4;
    }

    parseIngredients() {

        const unitsLong = ['tablespoons','tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz','tsp' ,'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            //1. uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });

            //2. remove {}
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. parse ingredients into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => {
                return unitShort.includes(el2);
            });

            let objIng;
            if(unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrIng[0])) {
                //there is no unit, but first element is a number
                objIng = {
                    count: parseInt(arrIng[0]),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            }
            else if(unitIndex === -1) {
                //There is no unit and no number
                objIng= {
                    count: 1,
                    unit: '' ,
                    ingredient
                }
            } 

            return objIng;
        });
        this.ingredients = newIngredients;
    }
};