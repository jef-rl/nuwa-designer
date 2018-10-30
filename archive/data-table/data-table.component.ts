import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent implements AfterViewInit {
  displayedColumns = ['name', 'age', 'email', 'phrase', 'edit'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(private afs: AngularFirestore, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.afs
      .collection<any>('hackers')
      .valueChanges()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '350px',
      data: data
    });
  }

  // Database seeding
  addOne() {
    const id = this.afs.createId();
    const hacker = {
      name: '',
      age: 25,
      email: '',
      phrase: '',
      uid: id
    };
    this.afs
      .collection('hackers')
      .doc(id)
      .set(hacker);
  }

  trackByUid(index, item) {
    return item.uid;
  }
}
