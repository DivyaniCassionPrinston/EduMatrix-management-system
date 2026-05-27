import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type Student = {
  id: number;
  name: string;
  address: string;
  fee: number;
};

@Component({
  selector: 'app-crud',
  imports: [ReactiveFormsModule],
  templateUrl: './crud.html',
  styleUrl: './crud.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Crud {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly nextId = signal(1);

  readonly students = signal<Student[]>([]);
  readonly editingId = signal<number | null>(null);
  readonly isEditing = computed(() => this.editingId() !== null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    fee: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });

  saveRecords(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const student: Student = {
      id: this.nextId(),
      name: value.name.trim(),
      address: value.address.trim(),
      fee: Number(value.fee),
    };

    this.students.update((current) => [...current, student]);
    this.nextId.update((id) => id + 1);
    this.resetForm();
  }

  updateRecords(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.editingId();
    if (id === null) {
      return;
    }

    const value = this.form.getRawValue();

    this.students.update((current) =>
      current.map((student) =>
        student.id === id
          ? {
              ...student,
              name: value.name.trim(),
              address: value.address.trim(),
              fee: Number(value.fee),
            }
          : student
      )
    );

    this.editingId.set(null);
    this.resetForm();
  }

  editRecord(student: Student): void {
    this.editingId.set(student.id);
    this.form.setValue({
      name: student.name,
      address: student.address,
      fee: String(student.fee),
    });
  }

  deleteRecord(id: number): void {
    this.students.update((current) => current.filter((student) => student.id !== id));
    if (this.editingId() === id) {
      this.editingId.set(null);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      address: '',
      fee: '',
    });
  }
}
