import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive, ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewContainerRef
} from '@angular/core';
import {AbstractControl, ControlContainer, NgControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {CommonInputErrorComponent} from './common-input-error-component/common-input-error.component';
import {CommonControlErrorContainerDirective} from './common-control-error-container.directive';
import {TranslateService} from '@ngx-translate/core';

@Directive({
  selector: '[formControl], [formControlName], [formGroup], [formGroupName], [formArrayName], [ngModel]'
})
export class CommonControlErrorsDirective implements OnInit, OnDestroy {
  @Input() customErrors = {};

  defaultErrors = {
    required: (error) => this.translateService.instant('form-errors.this-field-is-required'),
    email: (error) => this.translateService.instant('form-errors.not-a-valid-email'),
    minlength: ({ requiredLength, actualLength }) =>
      `${this.translateService.instant('form-errors.minimal-length-should-be')} ${requiredLength}
      ${this.translateService.instant('form-errors.but-got')} ${actualLength}`,
    pattern: (error) => this.translateService.instant('form-errors.input-is-not-matching-required-pattern'),
    passwordMatch: (error) => this.translateService.instant('form-errors.passwords-are-not-matching'),
    addressInvalid: (error) => this.translateService.instant('form-errors.address-is-invalid')
  };

  private ref: ComponentRef<CommonInputErrorComponent>;
  private anchor: ViewContainerRef;
  private control: AbstractControl;
  valueChangeSub$: Subscription;

  constructor(
      private vcr: ViewContainerRef,
      private resolver: ComponentFactoryResolver,
      private host: ElementRef,
      private translateService: TranslateService,
      @Optional() @Self() private ngControl: NgControl,
      @Optional() @Self() private controlContainer: ControlContainer,
      @Optional() private controlErrorContainer: CommonControlErrorContainerDirective,
  ) {
    this.anchor = controlErrorContainer ? controlErrorContainer.vcr : vcr;
  }

  ngOnInit(): void {
    this.control  = (this.controlContainer || this.ngControl).control;
    this.valueChangeSub$ = this.control
        .valueChanges
        .subscribe(() => {
          const controlErrors = this.control.errors;
          if (controlErrors) {
            const [firstKey] = Object.keys(controlErrors);
            const getError = this.customErrors[firstKey] || this.defaultErrors[firstKey];

            if (!getError) {
              return;
            }

            const text = typeof getError === 'function' ? getError(controlErrors[firstKey]) : getError;
            this.setError(text);
          } else if (this.ref) {
            this.setError(null);
          }
        });
  }

  setError(text: string) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(CommonInputErrorComponent);
      this.ref = this.vcr.createComponent(factory);
    }

    this.ref.instance.text = text;
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.destroy();
    }
    this.ref = null;
    this.valueChangeSub$.unsubscribe();
  }

}
