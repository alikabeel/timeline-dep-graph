/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Timeline } from 'vis';

import { earliestItem, ItemData, latestItem } from '../Item';

const ZOOM_RATIO = 0.2;
const MOTION_RATIO = 0.2;

@Component({
  selector: 'tdg-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnChanges {

  grouped = false;
  rollingMode = false;

  @Input() timeline: Timeline;

  @Output() groupedTimeline = new EventEmitter<boolean>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.timeline) {
      return;
    }
    if (changes.timeline) {
      const prev = changes.timeline.previousValue;
      const curr = changes.timeline.currentValue;
      if (!prev && curr) {
        curr.on('currentTimeTick', () => {
          if (this.rollingMode) {
            const range = this.timeline.getWindow();
            const interval = range.end - range.start;

            let newEnd = new Date().getTime();
            let newStart = newEnd - interval;

            newStart += interval * MOTION_RATIO;
            newEnd += interval * MOTION_RATIO;

            this.timeline.setWindow({
              start: new Date(newStart),
              end: new Date(newEnd),
              animation: false,
            });
          }
        });
      }
    }
  }

  zoomIn(): void {
    this.timeline.zoomIn(ZOOM_RATIO, { animation: !this.rollingMode });
  }

  zoomOut(): void {
    this.timeline.zoomOut(ZOOM_RATIO, { animation: !this.rollingMode });
  }

  moveLeft(): void {
    this.move(MOTION_RATIO);
  }

  moveRight(): void {
    this.move(-MOTION_RATIO);
  }

  fit(): void {
    this.timeline.fit();
  }

  groupTasks(): void {
    this.grouped = !this.grouped;
    this.groupedTimeline.emit(this.grouped);
  }

  focusEarliest(): void {
    const item = earliestItem(this.timeline.itemSet.items);
    this.focusOnItem(item);
  }

  focusLatest(): void {
    const item = latestItem(this.timeline.itemSet.items);
    this.focusOnItem(item);
  }

  toggleRolling(): void {
    this.rollingMode = !this.rollingMode;
  }

  private focusOnItem(item: ItemData): void {
    if (!item.start || !item.end) {
      return;
    }
    /*
     * Set the timeline visible window's start time to
     * 5 seconds before the task start time,
     * and the end time to 5 seconds after the task finish time.
     */
    this.timeline.setWindow({
      start: new Date(item.start.getTime() - (1000 * 5)),
      end: new Date(item.end.getTime() + (1000 * 5))
    });
  }

  private move(percentage): void {
    const range = this.timeline.getWindow();
    const interval = range.end - range.start;

    this.timeline.setWindow({
      start: range.start.valueOf() - interval * percentage,
      end: range.end.valueOf() - interval * percentage,
    });
  }
}
