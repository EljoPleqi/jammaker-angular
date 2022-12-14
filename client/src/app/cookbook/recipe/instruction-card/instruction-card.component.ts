import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { skip, Subscription, switchMap } from 'rxjs';
import { Instruction } from 'src/app/shared/interfaces/instruction';
import { RecipeUpdateStateService } from '../shared/services/recipe-update-state.service';

@Component({
  selector: 'app-instruction-card',
  templateUrl: './instruction-card.component.html',
  styleUrls: ['./instruction-card.component.scss'],
})
export class InstructionCardComponent implements OnInit, OnDestroy {
  @Input() instructions: Instruction[] | undefined = [];
  @Input() toggleEdit: boolean = false;

  @Output() getNewInstructions: EventEmitter<Instruction[]> = new EventEmitter<
    Instruction[]
  >();

  editInstructionsForm: FormGroup;
  newInstructions: FormArray;

  faTrashCan = faTrashCan;

  gatherDataSub: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private recipeUpdateStateService: RecipeUpdateStateService
  ) {
    this.editInstructionsForm = this.fb.group({
      instructions: this.fb.array([]),
    });
    this.newInstructions = <FormArray>(
      this.editInstructionsForm.get('instructions')
    );
  }

  ngOnInit(): void {
    this.instructions?.forEach((instruction: Instruction) => {
      this.newInstructions.push(this.fb.control(instruction.content));
    });
    console.log(this.newInstructions.value);
    this.gatherData();
  }

  onDeleteInstruction(index: number) {
    this.newInstructions.removeAt(index);
    console.log(this.newInstructions.value);
    this.gatherData();
  }

  private assembleNewInstrucastions = (form: FormGroup) =>
    form.get('instructions')?.value as Instruction[];

  private gatherData() {
    this.recipeUpdateStateService.gatherData$
      .pipe(skip(1))
      .pipe(
        switchMap((_) =>
          this.recipeUpdateStateService.gatherNewInstructions(
            this.assembleNewInstrucastions(this.editInstructionsForm)
          )
        )
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.gatherDataSub.unsubscribe();
  }
}
