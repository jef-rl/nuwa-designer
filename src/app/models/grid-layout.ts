// export interface Area {
//   id: string;
//   name:string;
//   designer: {
//     rowFrom:number;
//     rowTo:number;
//     colFrom:number;
//     colTo:number;
//     style: string;
//   },
//   result : {
//     row:string;
//     column: string;
//   }
// }
export interface Outlet {
  fromCol: number;
  toCol: number;
  fromRow: number;
  toRow: number;
  name: string;
  placementX?: string;
  placementY?: string;
  css?: string;
  properties?: { key: string; value: any }[];
  html?: string;
}
export interface Grid {
  id: string;
  name: string;
  uploaded?: boolean;
  destination?: string;
  includedata?: boolean;
  path?: string;
  minW?: string;
  width?: string;
  maxW?: string;
  minH?: string;
  height?: string;
  maxH?: string;
  rows: number;
  columns: number;
  heights: string[];
  widths: string[];
  outlets: Outlet[];
  input?: string;
  fsdoc?: string;
  model?: string;
  gap?: string;
}

// export interface Layout {
//   id: string;
//   name:string;
//   designer: {
//     grid: string;
//     areas: string[];
//   },
//   result: {
//       rows:string;
//     columns: string;
//     areas : {

//     }
//     }
//   }
// }
