import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should render the form", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("form")).toBeTruthy();
  })

  it("legend should have signup", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("legend")?.textContent).toMatch("Login");
  })
});
