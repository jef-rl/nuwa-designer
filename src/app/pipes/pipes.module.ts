import { NgModule } from '@angular/core';
import { VImgIdPipe, VImgMdPipe, VImgsMdPipe, SiteImagePipe } from './v_img.pipe';
import { ContainsPipe } from './contains.pipe';
import { SplitPipe } from './split.pipe';

@NgModule({
   declarations: [
      VImgIdPipe,
      VImgMdPipe,
      VImgsMdPipe,
      SiteImagePipe,
      ContainsPipe,
      SplitPipe
   ],
   exports: [
      VImgIdPipe,
      VImgMdPipe,
      VImgsMdPipe,
      SiteImagePipe,
      ContainsPipe,
      SplitPipe
   ]
})
export class PipesModule {}
