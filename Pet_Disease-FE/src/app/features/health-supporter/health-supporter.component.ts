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
  selector: 'app-health-supporter',
  templateUrl: './health-supporter.component.html',
  styleUrls: ['./health-supporter.component.scss']
})
export class HealthSupporterComponent implements OnInit {
  openCVLoadResult: Observable<OpenCVLoadResult>;
  uploaderItems$: Observable<Uploader[]>;
  uploaderItemsLength: number;
  selectedFiles: FileList;
  progressInfos = [];
  message: string;
  diseasePercentage: any = 0;
  active: Number = 1;
  activeType: Number = 1;
  activeType2: Number = 1;
  pointCount: Number;
  whiteDotsCount: number = 0;
  yellowDotsCount: number = 0;
  Output: number;
  imageUploadBoolean: number = 0;
  selectedDiseaseFeline: any[] = [];
  selectedDiseaseCanine: any[] = [];
  selectedPetCategory: number = 0;
  selectedPetCategoryName: string = 'feline';

  resultList : any[] = [
    { id: 1, name: 'Abdominal bloating' },
    { id: 2, name: 'Abdominal pain' },
    { id: 3, name: 'Acne' },
    { id: 4, name: 'Aggression' }
  ];

  diseasesFeline = [
    { id: 1, name: 'Abdominal bloating' },
    { id: 2, name: 'Abdominal pain' },
    { id: 3, name: 'Acne' },
    { id: 4, name: 'Aggression' },
    { id: 5, name: 'Anemia' },
    { id: 6, name: 'Apprehension' },
    { id: 7, name: 'Bacteria infection' },
    { id: 8, name: 'Biting' },
    { id: 9, name: 'Biting infected areas' },
    { id: 10, name: 'Bloody diarrhea' },
    { id: 11, name: 'Chewing' },
    { id: 12, name: 'Circling' },
    { id: 13, name: 'Complete paralysis' },
    { id: 14, name: 'Convulsion' },
    { id: 15, name: 'Convulsion contraction' },
    { id: 16, name: 'Coughing' },
    { id: 17, name: 'Crusty skin' },
    { id: 18, name: 'Dehydration' },
    { id: 19, name: 'Dementia' },
    { id: 20, name: 'Depression' },
    { id: 21, name: 'Diarrhea' },
    { id: 22, name: 'Disorientation' },
    { id: 23, name: 'Dyspnea' },
    { id: 24, name: 'Eating unusual objects' },
    { id: 25, name: 'Emaciation' },
    { id: 26, name: 'Enamel hypoplasia' },
    { id: 27, name: 'Fatigue' },
    { id: 28, name: 'Fever' },
    { id: 29, name: 'Foaming at mouth' },
    { id: 30, name: 'Frequent urination' },
    { id: 31, name: 'Hair loss' },
    { id: 32, name: 'Head tilt' },
    { id: 33, name: 'Hiding in dark places' },
    { id: 34, name: 'Hyperkeratosis' },
    { id: 35, name: 'Incoordination' },
    { id: 36, name: 'Increased thirst' },
    { id: 37, name: 'Inflamed skin' },
    { id: 38, name: 'Involuntary jerky twitching' },
    { id: 39, name: 'Irritability' },
    { id: 40, name: 'Irritated skin' },
    { id: 41, name: 'Itchiness' },
    { id: 42, name: 'Joint pain' },
    { id: 43, name: 'Labored breathing' },
    { id: 44, name: 'Lethargy' },
    { id: 45, name: 'Licking' },
    { id: 46, name: 'Licking infected areas' },
    { id: 47, name: 'Loss of appetite' },
    { id: 48, name: 'Lymph node inflammation' },
    { id: 49, name: 'Muscle contraction' },
    { id: 50, name: 'Muscle stiffness' },
    { id: 51, name: 'Nystagmus' },
    { id: 52, name: 'Paralysis of hind legs' },
    { id: 53, name: 'Paralysis of jaw muscles' },
    { id: 54, name: 'Paralysis of throat' },
    { id: 55, name: 'Partial paralysis' },
    { id: 56, name: 'Pimple-like lesions' },
    { id: 57, name: 'Pneumonia' },
    { id: 58, name: 'Purulent nasal discharge' },
    { id: 59, name: 'Pus filled blisters' },
    { id: 60, name: 'Rash' },
    { id: 61, name: 'Restlessness' },
    { id: 62, name: 'Seizures' },
    { id: 63, name: 'Scratching infected areas' },
    { id: 64, name: 'Skin color changes' },
    { id: 65, name: 'Snapping at any form of stimulus' },
    { id: 66, name: 'Staggering' },
    { id: 67, name: 'Sudden death' },
    { id: 68, name: 'Swelling in joints' },
    { id: 69, name: 'Thick yellow crusts' },
    { id: 70, name: 'Thickening of skin' },
    { id: 71, name: 'Twitching' },
    { id: 72, name: 'Ulcer (Around mouth and/or genitals)' },
    { id: 73, name: 'Vomiting' },
    { id: 74, name: 'Weakness' },
    { id: 75, name: 'Weight loss' },
    { id: 76, name: 'Yeast infection' },
  ];

  diseasesCanine = [
    { id: 1, name: 'Aggression' },
    { id: 2, name: 'Ascites (Swelling of abdomen)' },
    { id: 3, name: 'Bleeding disorders' },
    { id: 4, name: 'Blood in urine' },
    { id: 5, name: 'Coma' },
    { id: 6, name: 'Crusty lesions on the skin (Nose, Face, or Ears)' },
    { id: 7, name: 'Crying out while urinating' },
    { id: 8, name: 'Depression' },
    { id: 9, name: 'Drooling' },
    { id: 10, name: 'Diarrhea' },
    { id: 11, name: 'Difficulty breathing' },
    { id: 12, name: 'Distress' },
    { id: 13, name: 'Emaciation' },
    { id: 14, name: 'Excessive drooling' },
    { id: 15, name: 'Excessive licking of genital areas' },
    { id: 16, name: 'Failure to thrive' },
    { id: 17, name: 'Fever' },
    { id: 18, name: 'Flaky skin' },
    { id: 19, name: 'Foaming at mouth' },
    { id: 20, name: 'Frequent attempts to urinate' },
    { id: 21, name: 'Frequent urination' },
    { id: 22, name: 'Hairless patches' },
    { id: 23, name: 'Hair loss' },
    { id: 24, name: 'Increased thrist' },
    { id: 25, name: 'Inflamed skin' },
    { id: 26, name: 'Intestinal blockages' },
    { id: 27, name: 'Intestinal compliations' },
    { id: 28, name: 'Irritated skin' },
    { id: 29, name: 'Itchiness' },
    { id: 30, name: 'Lethargy' },
    { id: 31, name: 'Loss of appetite' },
    { id: 32, name: 'Loss of muscle control' },
    { id: 33, name: 'Paralysis of hind legs' },
    { id: 34, name: 'Prolonged attempts to urinate' },
    { id: 35, name: 'Red skin' },
    { id: 36, name: 'Ring-like lesions on the skin' },
    { id: 37, name: 'Seizures' },
    { id: 38, name: 'Shaggy coat' },
    { id: 39, name: 'Straining to urinate' },
    { id: 40, name: 'Sudden death' },
    { id: 41, name: 'Tapeworms in feces' },
    { id: 42, name: 'Urinating small amounts' },
    { id: 43, name: 'Urinating outside the litter box' },
    { id: 44, name: 'Vomiting' },
    { id: 45, name: 'Weakness' },
    { id: 46, name: 'Weight loss' },
    { id: 47, name: 'Yellow eyes' },
    { id: 48, name: 'Yellow gums' },
    { id: 49, name: 'Yellow skin' },
  ];

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
    private router: Router,
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
          })).subscribe(() => { },
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
      Q1: [(this.formGroup.controls.Q1.value == true) ? 1 : 0],
      Q2: [(this.formGroup.controls.Q2.value == true) ? 1 : 0],
      Q3: [(this.formGroup.controls.Q3.value == true) ? 1 : 0],
      Q4: [(this.formGroup.controls.Q4.value == true) ? 1 : 0],
      Q5: [(this.formGroup.controls.Q5.value == true) ? 1 : 0],
      Q6: [(this.formGroup.controls.Q6.value == true) ? 1 : 0],
      Q7: [(this.formGroup.controls.Q7.value == true) ? 1 : 0],
      Q8: [(this.formGroup.controls.Q8.value == true) ? 1 : 0],
      Q9: [(this.formGroup.controls.Q9.value == true) ? 1 : 0],
      Q10: [(this.formGroup.controls.Q10.value == true) ? 1 : 0],
      Q11: [(this.formGroup.controls.Q11.value == true) ? 1 : 0],
      Q12: [(this.formGroup.controls.Q12.value == true) ? 1 : 0],
      Q13: [(this.formGroup.controls.Q13.value == true) ? 1 : 0],
      Q14: [(this.formGroup.controls.Q14.value == true) ? 1 : 0],
      Q15: [(this.formGroup.controls.Q15.value == true) ? 1 : 0],
      Q16: [(this.formGroup.controls.Q16.value == true) ? 1 : 0],
      Q17: [(this.formGroup.controls.Q17.value == true) ? 1 : 0],
      Q18: [(this.formGroup.controls.Q18.value == true) ? 1 : 0],
      Q19: [(this.formGroup.controls.Q19.value == true) ? 1 : 0],
      Q20: [(this.formGroup.controls.Q20.value == true) ? 1 : 0]
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

  clearDiseaseFeline() {
    this.selectedDiseaseFeline = [];
  }


  clearDiseaseCanine() {
    this.selectedDiseaseCanine = [];
  }

  onSavePetCategory(value: number) {
    this.selectedPetCategory = value;
    if (this.selectedPetCategory == 1) {
      this.selectedPetCategoryName = 'canine';
    } else {
      this.selectedPetCategoryName = 'feline';
    }

  }

}

