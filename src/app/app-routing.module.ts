import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {AuthComponent} from "./auth/auth.component";
import {preloadAndParseTemplate} from "@angular/compiler-cli/src/ngtsc/annotations/component/src/resources";

const appRoute: Routes = [
  {
    path: "",
    redirectTo: "/recipes",
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(i => i.RecipesModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(i => i.ShoppingListModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(i => i.AuthModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(appRoute, {
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
