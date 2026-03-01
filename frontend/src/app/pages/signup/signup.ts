import { Component, signal } from '@angular/core';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
interface signupData {
  username: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-signup',
  imports: [FormField],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupModel = signal<signupData>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  signupForm = form(this.signupModel, (schema) => {
    required(schema.username, { message: 'username is required' });
    minLength(schema.username, 4, { message: 'username must have at least 4 characters' });

    required(schema.password, { message: 'password is required' });
    minLength(schema.password, 8, { message: 'password must have at least 4 characters' });

    required(schema.confirmPassword, { message: 'confirm password is required' });
    validate(schema.confirmPassword, ({ value, valueOf }) => {
      const password = valueOf(schema.password);
      const confirmPassword = value();

      if (confirmPassword !== password)
        return { kind: 'passwordMismatch', message: "passwords don't match" };

      return null;
    });
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.signupForm.password().errors());
  }
}
