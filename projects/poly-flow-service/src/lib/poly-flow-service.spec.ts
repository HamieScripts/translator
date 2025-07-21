import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolyFlowService } from './poly-flow-service';

describe('PolyFlowService', () => {
  let component: PolyFlowService;
  let fixture: ComponentFixture<PolyFlowService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolyFlowService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolyFlowService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
