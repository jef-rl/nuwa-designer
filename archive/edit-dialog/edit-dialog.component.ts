import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.sass']
})
export class EditDialogComponent {
  model:{
    FieldName : string,
    DefaultValue: any,
  };

  constructor(
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEmail(): void {
    this.afs
      .collection('models')
      .doc(this.data.uid)
      .update(this.model);
    this.dialogRef.close();
  }
}
