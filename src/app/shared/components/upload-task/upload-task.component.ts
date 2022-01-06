import {Component, Input, OnInit} from '@angular/core';
import {finalize, tap} from 'rxjs/operators';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {PhotoUrlService} from '../../../selltokens/services/photo-url.service';
import {ThumbnailUrlService} from '../../../selltokens/services/thumbnail-url.service';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  @Input() thumbnailFile: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  downloaded = false;
  thumbnailURL: string;

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private photoUrlService: PhotoUrlService,
              private thumbnailUrlService: ThumbnailUrlService) { }

  ngOnInit(): void {
    this.startUpload();

  }

  async startUpload(): Promise<void> {

    const path = `uploads/${Date.now()}_${this.file.name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, this.file);

    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async () =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.downloaded = true;
        console.log('URL', this.downloadURL);
        this.photoUrlService.changeUrl(this.downloadURL);
        this.db.collection('files').add( { downloadURL: this.downloadURL, path });
        return;
      }),
      finalize(async () => {
        this.startUploadThumbnail();
      }),
    );
  }

  async startUploadThumbnail(): Promise<void> {
    const path = `uploads/thumbnails/${Date.now()}_${this.thumbnailFile.name}_thumbnail`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, this.thumbnailFile);

    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async () =>  {
        this.thumbnailURL = await ref.getDownloadURL().toPromise();
        this.downloaded = true;
        console.log('URL', this.thumbnailURL);
        this.thumbnailUrlService.changeUrl(this.thumbnailURL);
        this.db.collection('files').add( { downloadURL: this.thumbnailURL, path });
        return;
      }),
    );
  }

  isActive(snapshot): boolean {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
