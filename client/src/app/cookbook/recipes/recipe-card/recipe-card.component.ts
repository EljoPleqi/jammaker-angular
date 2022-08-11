import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/shared/interfaces/recipe';
import { GetRecipeService } from 'src/app/shared/services/get-recipe.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe!: Recipe;

  constructor(private route: Router) {}
  onOpenRecipe() {
    this.route.navigate([`recipe/${this.recipe.id}`, `${this.recipe}`]);
  }
  ngOnInit(): void {}
}