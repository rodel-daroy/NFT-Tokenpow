import {Component, Input} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'uploader',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() imgUrl: string;

  constructor(private toastrService: ToastrService,
              private translateService: TranslateService) {
  }

  isHovering: boolean;

  displayDialog: boolean;

  files: File[] = [];
  source: string;
  thumbnailFile: File;

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(files: FileList): void {
    // TODO remove deleted image from storage
    this.files = [];
    if (files.length > 1) {
      this.toastrService.error(this.translateService.instant('shared.file-upload.you-can-upload-only-one-picture-at-a-time'));
    } else {
        const reader = new FileReader();

        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
          const image = new Image();

          image.src = e.target.result.toString();

          image.onload = (event: any) => {
            const aspectRatio = this.getImageWidth(event) / this.getImageHeight(event);
            // Need to have aspect ratio around 1.5
            console.log(aspectRatio);
            if (this.checkIfAspectRatioIsCorrect(aspectRatio)) {
              if (this.getImageWidth(event) > 920) {
                const multiplier = this.countResizeMultiplier(this.getImageWidth(event));
                if (multiplier > 0) {
                  this.compressImage(
                    e.target.result.toString(),
                    (this.getImageWidth(event) / multiplier),
                    (this.getImageHeight(event) / multiplier)
                  )
                    .then((result) => {
                      this.files.push(result);
                    });
                }
              } else {
                this.files.push(files[0]);
              }

              this.createThumbnail(e.target.result.toString()).then((result) => {
                this.thumbnailFile = result;
              });
            } else {
              this.displayDialog = true;
              // this.toastrService.error('Please upload image with horizontal aspect ratio (e.g. 16:9 or 4:3), not vertical', 'Bad aspect ratio');
            }
          };
        };
    }
  }

  getImageHeight(event): number {
    if (event?.path) {
      return Number(event?.path[0]?.height);
    } else if (event?.srcElement) {
      return Number(event?.srcElement?.height);
    }
  }

  getImageWidth(event): number {
    if (event?.path) {
      return Number(event?.path[0]?.width);
    } else if (event?.srcElement) {
      return Number(event?.srcElement?.width);
    }
  }

  checkIfAspectRatioIsCorrect(aspectRatio: number): boolean {
    return aspectRatio <= 1.9 && aspectRatio >= 1.2;
  }

  compressImage(src, newX, newY): Promise<any> {
    // 920x650
    return new Promise((res, rej) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;

        const ctx = elem.getContext('2d');
        ctx.drawImage(image, 0, 0, newX, newY);
        ctx.canvas.toBlob((blob) => {
          res(blob);
        }, 'img/jpg');
      };
      image.onerror = error => rej(error);
    });
  }

  countResizeMultiplier(newImageWidth: number): number {
    return Math.round(newImageWidth / 960);
  }


  createThumbnail(src): Promise<any> {
    // 286x185
    return new Promise((res, rej) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = 286;
        elem.height = 185;

        const ctx = elem.getContext('2d');
        ctx.drawImage(image, 0, 0, 286, 185);
        ctx.canvas.toBlob((blob) => {
          res(blob);
        }, 'img/jpg');
      };
      image.onerror = error => rej(error);
    });
  }


}
