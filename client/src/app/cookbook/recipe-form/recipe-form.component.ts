import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { PostUserTypedRecipeService } from 'src/app/shared/services/post-user-typed-recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-form',
  host: {
    class: 'flex flex-col h-full justify-center items-center',
  },
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  ingredientsArray: string[] = [];
  instructionsArray: string[] = [];

  @ViewChild('ingredient', { static: true }) ingredient!: ElementRef;
  @ViewChild('instruction', { static: true }) instruction!: ElementRef;
  constructor(
    private postUserRecipe: PostUserTypedRecipeService,
    private route: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(formData: NgForm) {
    const recipe: Recipe = formData.form.value;
    recipe.ingredients = this.ingredientsArray.join('-');
    recipe.instructionsString = this.instructionsArray.join('-');
    this.postUserRecipe.PostUserRecipe(recipe).subscribe((data) => {
      console.log(data);
      this.route.navigate([`recipe/${data.id}`, `${data.playlistId}`]);
    });
  }

  _addToArray(array: string[], element: string) {
    array.push(element);
  }

  onAddIngredient() {
    this._addToArray(
      this.ingredientsArray,
      this.ingredient.nativeElement.value
    );
  }
  onAddInstruction() {
    this._addToArray(
      this.instructionsArray,
      this.instruction.nativeElement.value
    );
  }
}