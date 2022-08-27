import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectDataService } from 'src/app/core/service/project-data.service';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { fromEvent, Observable } from 'rxjs';
import { switchMap, tap, toArray } from 'rxjs/operators';
import { Uploader } from 'src/app/core/state/uploader/uploader.model';
import { UploaderDataService } from 'src/app/core/state/uploader/uploader-data.service';
import { UploaderService } from 'src/app/core/state/uploader/uploader.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-detect-disorder',
  templateUrl: './detect-disorder.component.html',
  styleUrls: ['./detect-disorder.component.scss']
})
export class DetectDisorderComponent implements OnInit {
  openCVLoadResult: Observable<OpenCVLoadResult>;
  uploaderItems$: Observable<Uploader[]>;
  uploaderItemsLength: number;
  selectedFiles: FileList;
  progressInfos = [];
  message: string;
  diseasePercentage: any = 0;
  active: Number = 1;
  activeType: Number = 1;
  pointCount: Number;
  whiteDotsCount: number = 0;
  yellowDotsCount: number = 0;
  Output: number;
  imageUploadBoolean:number = 0;

  @ViewChild('fileInput')
  fileInput: ElementRef;
  @ViewChild('canvas')
  canvas: ElementRef;

  formGroup: FormGroup = new FormGroup({
    Q1: new FormControl(''),
    Q2: new FormControl(''),
    Q3: new FormControl(''),
    Q4: new FormControl(''),
    Q5: new FormControl(''),
    Q6: new FormControl(''),
    Q7: new FormControl(''),
    Q8: new FormControl(''),
    Q9: new FormControl(''),
    Q10: new FormControl(''),
    Q11: new FormControl(''),
    Q12: new FormControl(''),
    Q13: new FormControl(''),
    Q14: new FormControl(''),
    Q15: new FormControl(''),
    Q16: new FormControl(''),
    Q17: new FormControl(''),
    Q18: new FormControl(''),
    Q19: new FormControl(''),
    Q20: new FormControl('')
  });

  constructor(private projectDataService: ProjectDataService,
    private ngOpenCVService: NgOpenCVService,
    private uploadService: UploaderDataService,
    private uploaderService: UploaderService,
    private router:Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.openCVLoadResult = this.ngOpenCVService.isReady$;
    if (this.uploadService.getFiles()) {
      this.message = 'Active';
    } else {
      this.message = 'Inactive';
    }
  }

  selectFiles(e): void {
    if (e.target.files.length) {
      const reader = new FileReader();
      const load$ = fromEvent(reader, 'load');
      load$
        .pipe(
          switchMap(() => {
            return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvas.nativeElement);
          })).subscribe(() => {},
          err => {
            console.log('Error loading image', err);
          });

      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: any) => {
        var myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function (ev: any) {
          let srcImg = cv.imread(myImage);
          console.log(srcImg);
          let dst = new cv.Mat();
          let dsize = new cv.Size(1000, 750);
          cv.resize(srcImg, dst, dsize, 0, 0, cv.INTER_AREA);
          cv.imshow("canvas", dst);
          // srcImg.delete();
          // dst.delete();
        };
      }
      const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    }
    this.progressInfos = [];
    this.selectedFiles = e.target.files;
  }

  uploadFiles(): void {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.spinner.show();
    this.uploadService.upload(file).subscribe(
      (res: HttpEvent<any>) => {

        if (res.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * res.loaded / res.total);
        }
        if (res.type === HttpEventType.Response) {
          console.log('Upload complete');
          console.log(res.body);
          this.diseasePercentage = res.body.diseasePercentage;
          this.whiteDotsCount = res.body.whiteDotsCount;
          this.yellowDotsCount = res.body.yellowDotsCount;
          this.active = 1;
          this.imageUploadBoolean = 1;
          this.spinner.hide();
          this.uploaderService.addUploaderItem({
            id: 1,
            diseasePercentage: this.diseasePercentage,
            whiteDotsCount: this.whiteDotsCount,
            yellowDotsCount: this.yellowDotsCount
          } as Uploader);

        }
      },
      (error) => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(error);
      }
    )
  }

  resetProject() {
    this.uploaderService.deleteUploaderItem(1);
    console.log("Clear Uploader DB");
  }

  onSubmit() {
    const data =
    {
      Q1: [(this.formGroup.controls.Q1.value==true) ? 1 : 0],
      Q2: [(this.formGroup.controls.Q2.value==true) ? 1 : 0],
      Q3: [(this.formGroup.controls.Q3.value==true) ? 1 : 0],
      Q4: [(this.formGroup.controls.Q4.value==true) ? 1 : 0],
      Q5: [(this.formGroup.controls.Q5.value==true) ? 1 : 0],
      Q6: [(this.formGroup.controls.Q6.value==true) ? 1 : 0],
      Q7: [(this.formGroup.controls.Q7.value==true) ? 1 : 0],
      Q8: [(this.formGroup.controls.Q8.value==true) ? 1 : 0],
      Q9: [(this.formGroup.controls.Q9.value==true) ? 1 : 0],
      Q10: [(this.formGroup.controls.Q10.value==true) ? 1 : 0],
      Q11: [(this.formGroup.controls.Q11.value==true) ? 1 : 0],
      Q12: [(this.formGroup.controls.Q12.value==true) ? 1 : 0],
      Q13: [(this.formGroup.controls.Q13.value==true) ? 1 : 0],
      Q14: [(this.formGroup.controls.Q14.value==true) ? 1 : 0],
      Q15: [(this.formGroup.controls.Q15.value==true) ? 1 : 0],
      Q16: [(this.formGroup.controls.Q16.value==true) ? 1 : 0],
      Q17: [(this.formGroup.controls.Q17.value==true) ? 1 : 0],
      Q18: [(this.formGroup.controls.Q18.value==true) ? 1 : 0],
      Q19: [(this.formGroup.controls.Q19.value==true) ? 1 : 0],
      Q20: [(this.formGroup.controls.Q20.value==true) ? 1 : 0]
    }

    if (this.formGroup.valid == true) {
      this.spinner.show();
      this.projectDataService.getPrediction(data).subscribe(res => {
        this.spinner.hide();
        console.log(res);
        this.Output = res.predict;
        console.log('Succefully Added');
        this.formGroup.reset();
      });
    }
    else {
      console.log('Something wrong');
    }

  }

  reset() {
    window.location.reload();
  }
}

