import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Timeline } from 'vis';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call zoomIn method on zooming in', () => {
    component.timeline = createMockTimeline();
    fixture.detectChanges();

    const deZoomInBtn = fixture.debugElement.query(By.css('button.zoomIn'));
    const zoomIn = deZoomInBtn.nativeElement;
    zoomIn.click();

    expect(component.timeline.zoomIn).toHaveBeenCalled();
  });

  it('should call zoomOut method on zooming out', () => {
    component.timeline = createMockTimeline();
    fixture.detectChanges();

    const deZoomOutBtn = fixture.debugElement.query(By.css('button.zoomOut'));
    const ZoomOut = deZoomOutBtn.nativeElement;
    ZoomOut.click();

    expect(component.timeline.zoomOut).toHaveBeenCalled();
  });

  it('should move the timeline window to the left with 0.2 precentage', () => {
    component.timeline = createMockTimeline();
    fixture.detectChanges();

    const demoveLeftBtn = fixture.debugElement.query(By.css('button.moveLeft'));
    const moveLeft = demoveLeftBtn.nativeElement;
    moveLeft.click();

    expect(component.timeline.setWindow).toHaveBeenCalledWith({
      start: -0.2,
      end: 0.8,
    });
  });

  it('should move the timeline window to the right with 0.2 precentage', () => {
    component.timeline = createMockTimeline();
    fixture.detectChanges();

    const demoveRightBtn = fixture.debugElement.query(By.css('button.moveRight'));
    const moveRight = demoveRightBtn.nativeElement;
    moveRight.click();

    expect(component.timeline.setWindow).toHaveBeenCalledWith({
      start: 0.2,
      end: 1.2,
    });
  });

});

function createMockTimeline(): Timeline {
  const mockTimeline = {
    zoomIn: jasmine.createSpy(),
    zoomOut: jasmine.createSpy(),
    setWindow: jasmine.createSpy(),
    getWindow: () => {
      return {
        start: {
          valueOf: () => 0
        },
        end: {
          valueOf: () => 1
        }
      };
    },
  } as Timeline;

  return mockTimeline;
}
