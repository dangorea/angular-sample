import {Recipe} from "./recipe.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'A test Recipe 1',
      "This is simply a test",
      "https://www.allrecipes.com/thmb/OY7-yexTvx87Q7jm_UGWdtEHb94=/771x514/filters:no_upscale():max_bytes(150000):strip_icc():focal(399x0:401x2):format(webp)/229949-creamy-white-chili-ddmfs-4x3-0039-fcb66b49658c42048e5ccbcaae74ebeb.jpg",
      [
        new Ingredient("Meat", 1),
        new Ingredient("French Fries", 20)
      ]
    ),
    new Recipe(
      'A test Recipe 2',
      "This is simply a test",
      "https://www.allrecipes.com/thmb/OY7-yexTvx87Q7jm_UGWdtEHb94=/771x514/filters:no_upscale():max_bytes(150000):strip_icc():focal(399x0:401x2):format(webp)/229949-creamy-white-chili-ddmfs-4x3-0039-fcb66b49658c42048e5ccbcaae74ebeb.jpg",
      [
        new Ingredient("Buns", 2),
        new Ingredient("Meat", 1)
      ]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
