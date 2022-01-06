import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartnerService } from '../services/partner.service';
import {User} from '../../auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
    selector: 'app-manage-collections',
    templateUrl: './manage-collections.component.html',
    styleUrls: ['./manage-collections.component.scss']
})
export class ManageCollectionsComponent implements OnInit, OnDestroy {

    collections: any = []
    modalShow = false
    header: any
    id: any = ""
    name: any = ""
    description: any = ""
    order: any = null
    type: any = "image"
    types: any = [
        "image", "video"
    ]
    url: any = ""
    isEdit: any = false
    user: User;
    selectedCollectionId: any
    duration: Number
    increment: Number

    file: any;
    task: AngularFireUploadTask;
    downloadURL: string;

    constructor(
        public authService: AuthService,
        public partnerService: PartnerService,
        private storage: AngularFireStorage,
        private stateService: AppStateService
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.partnerService.getCollectionsByUser(this.user.uid).subscribe(res => {
                this.collections = res
            })
        });
    }

    ngOnDestroy(): void {
    }

    createCollectionBtn() {
        this.header = "Create Collection"
        this.modalShow = true;
        this.isEdit = false
        this.id = uuidv4()
        this.name = ""
        this.description = ""
        this.order = this.collections.length
        this.type = "image"
        this.url = ""
        //this.duration = 1440
        //this.increment = 1
        this.selectedCollectionId = null
    }

    async confirmBtn() {
        this.modalShow = false;
        if (this.file) {
            const filePath = `collections/${Date.now()}_${this.file.name}`;  // path at which image will be stored in the firebase storage
            this.task =  this.storage.upload(filePath, this.file);    // upload task

            // this.progress = this.snapTask.percentageChanges();

            this.stateService.changeState('loading');
            (await this.task).ref.getDownloadURL().then(async url => {
                this.url = url;
                this.submitCollection()
                this.stateService.changeState('normal')
            });  // <<< url is found here
        } else {
            this.submitCollection()
        }
    }

    submitCollection() {
        if (this.isEdit) {
            this.partnerService.updateCollection(this.selectedCollectionId, this.name, this.description, this.type, this.url, this.duration, this.increment)
        } else {
            this.partnerService.createCollection(this.user.uid, this.id, this.name, this.description, this.order, this.type, this.url, this.duration, this.increment)
        }
    }

    editCollection(collectionId, id, name, description, order, type, url, duration, increment) {
        this.header = "Edit Collection"
        this.modalShow = true;
        this.isEdit = true
        this.id = id
        this.name = name
        this.description = description
        this.order = order
        this.type = type
        this.url = url
        this.duration = duration
        this.increment = increment
        this.selectedCollectionId = collectionId
    }

    uploadFile(event) {
        this.file = event[0]
    }
    deleteAttachment() {
        this.file = null
    }
}
