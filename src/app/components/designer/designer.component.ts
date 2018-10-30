import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Grid, Outlet } from '../../models/grid-layout';
import { AngularFirestore } from 'angularfire2/firestore';
import { slugify } from '../../functions/slugify';
import * as _ from 'lodash';
import { AngularFireStorage } from 'angularfire2/storage';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

// Initial Height Width Areas
const initHeightsWidths = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
];

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {
  newProperty = { key: '', value: '' };
  previewSrc = null;
  leftopen = true;
  showCode = false;
  designerFiles;
  editingOutlet = false;
  schema: any;
  layout: any;
  data: any;
  flatareas: any;
  activeDesign: Grid = {
    id: null,
    name: 'grd',
    rows: 3,
    columns: 3,
    heights: [...initHeightsWidths],
    widths: [...initHeightsWidths],
    outlets: [],
    model: ''
  };
  outlet: Outlet;
  rowId: any;
  columnId: any;
  fromRowId: any;
  fromColumnId: any;
  toRowId: any;
  toColumnId: any;
  constructor(
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {
    const files = this.afs
      .collection('designer')
      .valueChanges()
      .subscribe(designerfiles => (this.designerFiles = designerfiles));
  }
  ngOnInit() {
    this.newOutlet();
  }
  newDesigner() {
    this.activeDesign = {
      id: null,
      name: 'grd',
      rows: 3,
      columns: 3,
      heights: [...initHeightsWidths],
      widths: [...initHeightsWidths],
      outlets: []
    };
  }
  loadDesigner(file) {
    this.activeDesign = file;
    this.previewSrc = this.activeDesign.uploaded
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          'http://localhost:4250/' + this.activeDesign.path
        )
      : null;
    this.outlet = null;
  }
  copyDesigner() {
    this.activeDesign.id = null;
    this.activeDesign.uploaded = false;
    this.saveDesigner();
  }
  loadfsdoc() {
    try {
      this.afs
        .doc(this.activeDesign.fsdoc)
        .valueChanges()
        .pipe(
          tap(doc => {
            this.activeDesign.model = JSON.parse(JSON.stringify(doc));
          })
        )
        .subscribe();
    } catch (err) {}
  }
  saveDesigner() {
    this.activeDesign.id =
      this.activeDesign.id === null
        ? this.afs.createId()
        : this.activeDesign.id;
    this.afs
      .collection('designer')
      .doc(this.activeDesign.id)
      .set(this.activeDesign);
  }
  resetOutlet() {
    this.outlet = null;
    this.editingOutlet = false;
  }
  newOutlet() {
    this.outlet = {
      fromCol: this.fromColumnId,
      toCol: this.toColumnId,
      fromRow: this.fromRowId,
      toRow: this.toRowId,
      name: '',
      css: '',
      html: ''
    };
    this.editingOutlet = true;
  }
  editOutlet(outlet) {
    this.outlet = outlet;
    this.fromColumnId = outlet.fromCol;
    this.toColumnId = outlet.toCol;
    this.fromRowId = outlet.fromRow;
    this.toRowId = outlet.toRow;
    this.editingOutlet = true;
  }
  deleteOutlet(outlet) {
    this.activeDesign.outlets = this.activeDesign.outlets.filter(
      o => o !== this.outlet
    );
    this.outlet = null;
  }
  saveOutlet(name?: string) {
    if (name !== '') {
      this.outlet.name = name;
      this.activeDesign.outlets = [
        ...this.activeDesign.outlets.filter(
          outlet => outlet.name !== this.outlet.name
        ),
        this.outlet
      ];
    }
    this.editingOutlet = false;
  }
  addProperty() {
    if (this.newProperty.key !== '' && this.newProperty.value !== '') {
      if (!this.outlet.properties) {
        this.outlet.properties = [];
      }
      const newProp = { ...this.newProperty };
      this.newProperty = { key: '', value: '' };
      this.outlet.properties = [...this.outlet.properties, newProp];
    }
  }
  getColumnWidths() {
    const _widths: string[] = this.activeDesign.widths;

    return _widths
      .map(w => (!w || w === '' ? 'auto' : w))
      .slice(1, this.activeDesign.columns + 1)
      .join(' ');
  }
  getRowHeights() {
    const _heights: string[] = this.activeDesign.heights;

    return _heights
      .map(h => (!h || h === '' ? 'auto' : h))
      .slice(1, this.activeDesign.rows + 1)
      .join(' ');
  }
  // getAreas() {
  //   const _areas: string[][] = this.model.designer.areas;
  //   let _rtn = '';
  //   for (let rowIdx = 1; rowIdx <= this.model.designer.rows; rowIdx++) {
  //     for (let colIdx = 1; colIdx <= this.model.designer.columns; colIdx++) {
  //       const _area = this.model.designer.areas[colIdx][rowIdx];
  //       _rtn = _rtn + ' ' + (!_area || _area === '' ? '.' : _area);
  //     }
  //     if (rowIdx < this.model.designer.rows) {
  //       _rtn = _rtn + ' | ';
  //     }
  //   }
  //   return _rtn;
  // }
  setCell(ev: MouseEvent, ci, ri) {
    if (this.outlet !== null && !ev.ctrlKey) {
      if (!ev.shiftKey) {
        this.fromRowId = ri;
        this.fromColumnId = ci;
        this.toRowId = ri;
        this.toColumnId = ci;
        this.outlet.fromCol = this.fromColumnId;
        this.outlet.toCol = this.toColumnId;
        this.outlet.fromRow = this.fromRowId;
        this.outlet.toRow = this.toRowId;
        this.saveOutlet(this.outlet.name);
      } else {
        this.toRowId = ri;
        this.toColumnId = ci;
        if (this.outlet.toRow < this.outlet.fromRow) {
          this.toRowId = this.fromRowId;
          this.fromRowId = ri;
        }
        if (this.outlet.toCol < this.outlet.fromCol) {
          this.toColumnId = this.fromColumnId;
          this.fromColumnId = ci;
        }
        this.outlet.fromCol = this.fromColumnId;
        this.outlet.toCol = this.toColumnId;
        this.outlet.fromRow = this.fromRowId;
        this.outlet.toRow = this.toRowId;
        this.saveOutlet(this.outlet.name);
      }
    } else {
      if (!ev.shiftKey || ev.ctrlKey) {
        this.fromRowId = ri;
        this.fromColumnId = ci;
        this.toRowId = ri;
        this.toColumnId = ci;
        this.newOutlet();
      } else {
        this.toRowId = ri;
        this.toColumnId = ci;
        if (this.outlet.toRow < this.outlet.fromRow) {
          this.toRowId = this.fromRowId;
          this.fromRowId = ri;
        }
        if (this.outlet.toCol < this.outlet.fromCol) {
          this.toColumnId = this.fromColumnId;
          this.fromColumnId = ci;
        }
        this.newOutlet();
      }
    }
  }
  // updateArea(txt) {
  //   for (let rowIdx = this.fromRowId; rowIdx <= this.toRowId; rowIdx++) {
  //     for (
  //       let colIdx = this.fromColumnId;
  //       colIdx <= this.toColumnId;
  //       colIdx++
  //     ) {
  //       this.model.designer.areas[colIdx][rowIdx] = txt;
  //     }
  //   }
  //   this.flatareas = [].concat(...this.model.designer.areas);
  // }
  updateHeights(txt) {
    for (let colIdx = this.fromColumnId; colIdx <= this.toColumnId; colIdx++) {
      this.activeDesign.heights[colIdx] = txt;
    }
  }
  updateWidths(txt) {
    for (let rowIdx = this.fromRowId; rowIdx <= this.toRowId; rowIdx++) {
      this.activeDesign.widths[rowIdx] = txt;
    }
  }
  filteredDesign() {
    return {
      ...this.activeDesign,
      heights: this.activeDesign.heights
        .map(h => (!h || h === '' ? 'auto' : h))
        .slice(1, this.activeDesign.rows + 1),
      widths: this.activeDesign.widths
        .map(w => (!w || w === '' ? 'auto' : w))
        .slice(1, this.activeDesign.columns + 1)
    };
  }
  getTs() {
    const slugname = _.kebabCase(this.activeDesign.name);
    const componentname = _.upperFirst(_.camelCase(this.activeDesign.name));
    const rtn = `
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-${slugname}',
  templateUrl: './${slugname}.component.html',
  styleUrls: ['./${slugname}.component.scss']
})
export class ${componentname}Component implements OnInit {
  @Input() ${this.activeDesign.input ? this.activeDesign.input : 'data'} ${
      this.activeDesign.includedata && this.activeDesign.model
        ? '= ' + this.activeDesign.model
        : ''
    };

  constructor() { }

  ngOnInit() {
  }

}
`;
    return rtn;
  }
  getHtml() {
    const cols = this.getColumnWidths();
    const rows = this.getRowHeights();
    const outlets = this.activeDesign.outlets;
    let content = '';
    if (outlets && outlets.length > 0) {
      for (let index = 0; index < outlets.length; index++) {
        const element = outlets[index];
        if (element.name !== '') {
          const htmlContent = `
          <div ${element.name}><div>${
            element.html ? element.html : ''
          }</div></div>
        `;
          content = content + htmlContent;
        }
      }
    }
    const slugname = slugify(this.activeDesign.name);
    const rtn = `
    <div ${slugname}>
      ${content}
    </div>
    `;
    return rtn
      .replace('\n\n', '\n')
      .replace('\n\n', '\n')
      .replace('\n\n', '\n')
      .replace('\n\n', '\n')
      .replace('\n\n', '\n');
  }
  getCss() {
    const cols = this.getColumnWidths();
    const rows = this.getRowHeights();
    const outlets = this.activeDesign.outlets;
    let content = '';
    if (outlets && outlets.length > 0) {
      for (let index = 0; index < outlets.length; index++) {
        const element = outlets[index];
        if (element.name !== '') {
          const htmlContent = `
div[${element.name}] {
  grid-column: ${element.fromCol} / ${element.toCol + 1};
  grid-row: ${element.fromRow} / ${element.toRow + 1};
  display: grid;
${element.placementX ? '  justify-items: ' + element.placementX + ';' : ''}
${element.placementY ? '  align-items: ' + element.placementY + ';' : ''}
${
            element.properties && element.properties.length > 0
              ? element.properties.reduce(
                  (acc, p) => acc + '  ' + p.key + ': ' + p.value + ';\n',
                  ''
                )
              : ''
          }
}
        `;
          content = content + htmlContent;
        }
      }
    }
    const slugname = slugify(this.activeDesign.name);
    const rtn = `
div[${slugname}] {
  display: grid;
  grid-template-columns: ${cols};
  grid-template-rows: ${rows};
${this.activeDesign.gap ? '  grid-gap: ' + this.activeDesign.gap + ';' : ''}
${this.activeDesign.minW ? '  min-width: ' + this.activeDesign.minW + ';' : ''}
${this.activeDesign.width ? '  width: ' + this.activeDesign.width + ';' : ''}
${this.activeDesign.maxW ? '  max-width: ' + this.activeDesign.maxW + ';' : ''}
${this.activeDesign.minH ? '  min-height: ' + this.activeDesign.minH + ';' : ''}
${this.activeDesign.height ? '  height: ' + this.activeDesign.height + ';' : ''}
${this.activeDesign.maxH ? '  max-height: ' + this.activeDesign.maxH + ';' : ''}
}

${content}
`;
    return rtn
      .replace('\n\n', '\n')
      .replace('\n\n', '\n')
      .replace('\n\n', '\n')
      .replace('\n\n', '\n')
      .replace('\n\n', '\n');
  }

  outTarget(outletItem) {
    return outletItem.html
      ? outletItem.html
      : outletItem.name
        ? outletItem.name
        : '';
  }

  uploadFiles() {
    const slugname = _.kebabCase(this.activeDesign.name);
    const componentname = _.upperFirst(_.camelCase(this.activeDesign.name));
    this.activeDesign.uploaded = true;
    this.activeDesign.path = componentname;
    this.http
      .post(
        'http://localhost:3000/',
        {
          path: componentname,
          slug: slugname,
          ts: this.getTs(),
          html: this.getHtml(),
          css: this.getCss()
        },
        httpOptions
      )
      .subscribe(res => {});
    this.previewSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://localhost:4250/' + this.activeDesign.path
    );
  }
  getPreviewSrc() {
    return this.previewSrc;
  }
}
