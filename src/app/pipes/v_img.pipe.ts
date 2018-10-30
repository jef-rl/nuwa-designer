import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'v_img_id'
})
export class VImgIdPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return (
      'https://firebasestorage.googleapis.com/v0/b/spa-voucher.appspot.com/o/v_img_id%2F' +
      value +
      '?alt=media'
    );
  }
}
@Pipe({
  name: 'v_img_md'
})
export class VImgMdPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return (
      'https://firebasestorage.googleapis.com/v0/b/spa-voucher.appspot.com/o/v_img_md%2F' +
      value +
      '?alt=media'
    );
  }
}

@Pipe({
  name: 'v_imgs_md'
})
export class VImgsMdPipe implements PipeTransform {
  transform(value: any[], args?: any): any {
    return value.map(
      v =>
        'https://firebasestorage.googleapis.com/v0/b/spa-voucher.appspot.com/o/v_img_md%2F' +
        v +
        '?alt=media'
    );
  }
}

@Pipe({
  name: 'site_image'
})
export class SiteImagePipe implements PipeTransform {
  transform(value: any[], args?: any): any {
    return (
      'https://firebasestorage.googleapis.com/v0/b/spa-voucher.appspot.com/o/site-content%2F' +
      value +
      '?alt=media'
    );
  }
}
