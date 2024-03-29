import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeScrapped } from '../interfaces/recipe.model';
import { RecipeData } from '../interfaces/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class PostUrlService {
  constructor(private http: HttpClient) {}

  postUrl(recipeData: RecipeScrapped, isMeal: boolean) {
    console.log(recipeData);
    return this.http.post<RecipeData>(
      `http://localhost:3000/api/v1/${isMeal ? 'recipes' : 'condiments'}`,
      { data: recipeData },
      { withCredentials: true }
    );
  }
}
