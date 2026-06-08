import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import {
  DEFAULT_PRODUCT_FILTERS,
  ProductFilters,
} from '../../models/product-filter.model';

@Component({
  selector: 'app-product-filter',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilter {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = input<string[]>([]);

  readonly filtersChange = output<ProductFilters>();

  protected readonly form =
    this.formBuilder.nonNullable.group({
      search: [
        DEFAULT_PRODUCT_FILTERS.search,
      ],
      category: [
        DEFAULT_PRODUCT_FILTERS.category,
      ],
      sort: [
        DEFAULT_PRODUCT_FILTERS.sort,
      ],
    });

  constructor() {
    this.form.valueChanges
      .pipe(
        debounceTime(350),

        map((): ProductFilters => {
          const values = this.form.getRawValue();

          return {
            search: values.search.trim(),
            category: values.category,
            sort: values.sort,
          };
        }),

        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) ===
            JSON.stringify(current),
        ),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((filters) => {
        this.filtersChange.emit(filters);
      });
  }

  protected clearSearch(): void {
    this.form.controls.search.setValue('');
  }

  protected resetFilters(): void {
    this.form.reset(DEFAULT_PRODUCT_FILTERS);

    this.filtersChange.emit({
      ...DEFAULT_PRODUCT_FILTERS,
    });
  }
}