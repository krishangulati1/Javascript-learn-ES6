import Search from './models/Search';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader, elementStrings } from './views/base';
import * as recipeView from './views/recipeView';

/**
 * Search Controller
 */
const state = {};
const controlSearch = async () => {
    //1. get query for view
    const query = searchView.getInput(); //TODO
    
    if(query) {
        //2. new search object and add a state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4. Search for recipes
        await state.search.getResults();

        // 5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
    console.log(btn);
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    console.log(id);

    if(id) {
        //prepare the ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected
        if(state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);


        try {
            //get recipe data and parseIng
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            //calculate serving and time
            state.recipe.calcTime();
            state.recipe.calServings();
    
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        }
        catch(err) {
            alert(err);
        }
    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'controlRecipe'].forEach(event => window.addEventListener(event, controlRecipe));