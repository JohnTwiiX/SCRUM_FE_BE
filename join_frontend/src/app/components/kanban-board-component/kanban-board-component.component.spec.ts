import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardComponentComponent } from './kanban-board-component.component';

describe('KanbanBoardComponentComponent', () => {
  let component: KanbanBoardComponentComponent;
  let fixture: ComponentFixture<KanbanBoardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KanbanBoardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
