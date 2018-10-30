import { AngularFirestore, FieldPath } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private afs: AngularFirestore) {}

  get(where?: {
    fieldPath: string | FieldPath;
    opStr: '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
    value: any;
  }) {
    if (where) {
      return this.afs
        .collection('projects', ref =>
          ref.where(where.fieldPath, where.opStr, where.value)
        )
        .valueChanges();
    }
    return this.afs.collection('projects').valueChanges();
  }
  save(project: Project) {
    if (project) {
      if (project.id === null) {
        project.id = project.path;
        this.afs
          .collection('projects')
          .doc(project.id)
          .set(project);
      } else {
        this.afs
          .collection('projects')
          .doc(project.id)
          .update(project);
      }
    }
  }
  delete(project: Project) {
    if (project) {
      if (project.id !== null) {
        this.afs
          .collection('projects')
          .doc(project.id)
          .delete();
      }
    }
  }
}
