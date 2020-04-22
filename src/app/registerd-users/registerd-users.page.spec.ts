import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterdUsersPage } from './registerd-users.page';

describe('RegisterdUsersPage', () => {
  let component: RegisterdUsersPage;
  let fixture: ComponentFixture<RegisterdUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterdUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterdUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
