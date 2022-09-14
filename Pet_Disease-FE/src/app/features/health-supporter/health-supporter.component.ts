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
  styleUrls: ['./health-supporter.component.scss'],
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
  prediction: string = '';
  Output: number;
  imageUploadBoolean: number = 0;
  selectedDiseaseFeline: any[] = [];
  selectedDiseaseCanine: any[] = [];
  selectedPetCategory: number = 0;
  selectedPetCategoryName: string = 'feline';
  analysisValue: any;

  resultList: any[] = [];

  diseasesFeline = [
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

  diseasesCanine = [
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

  @ViewChild('fileInput')
  fileInput: ElementRef;
  @ViewChild('canvas')
  canvas: ElementRef;

  constructor(
    private projectDataService: ProjectDataService,
    private ngOpenCVService: NgOpenCVService,
    private uploadService: UploaderDataService,
    private uploaderService: UploaderService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

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
            return this.ngOpenCVService.loadImageToHTMLCanvas(
              `${reader.result}`,
              this.canvas.nativeElement
            );
          })
        )
        .subscribe(
          () => { },
          (err) => {
            console.log('Error loading image', err);
          }
        );

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
          cv.imshow('canvas', dst);
          // srcImg.delete();
          // dst.delete();
        };
      };
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
          this.progressInfos[idx].value = Math.round(
            (100 * res.loaded) / res.total
          );
        }
        if (res.type === HttpEventType.Response) {
          console.log('Upload complete');
          console.log(res.body);
          this.analysisValue = res.body;
          if (res.body.prediction == 'CanineImpetigo') {
            this.resultList.push('Canine Impetigo');
          }else{
            this.resultList.push('Canine Lupus');
          }
          this.diseasePercentage = res.body.diseasePercentage;
          this.prediction = res.body.prediction;
          this.active = 3;
          this.imageUploadBoolean = 1;
          this.spinner.hide();
          this.uploaderService.addUploaderItem({
            id: 1,
            diseasePercentage: this.diseasePercentage,
            prediction: this.prediction
          } as Uploader);
        }
      },
      (error) => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(error);
      }
    );
  }

  resetProject() {
    this.uploaderService.deleteUploaderItem(1);
    console.log('Clear Uploader DB');
  }

  getPredictionOutput() {
    if (this.selectedPetCategoryName == 'feline') {
      this.spinner.show();
      this.projectDataService
        .getPrediction(this.selectedDiseaseFeline)
        .subscribe((res) => {
          this.spinner.hide();
          console.log(res);
          this.resultList = res.predict;
          console.log('Succefully Added');
          console.log(this.resultList);
        });
    } else {
      this.spinner.show();
      this.projectDataService
        .getPrediction(this.selectedDiseaseCanine)
        .subscribe((res) => {
          this.spinner.hide();
          console.log(res);
          this.resultList = res.predict;
          console.log('Succefully Added');
        });
    }

    this.active = 3;
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

  getTableData(value: string) {
    const tableData = [
      {
        id: 1,
        name: 'Feline Ringworms',
        symptoms:
          'Inflamed skin, Ring- like lesions on the skin, Itchiness, Hairless patches, Crusty lesions on the skin',
        treatment:
          'Apply topical antifungal medications to all infected areas, Hair clipping, Chlorhexidine+miconazole based shampoo (twice a week), Lime sulfur dip (twice a week)',
      },
      {
        id: 2, name: 'Feline Mange',
        symptoms:
          'Hairloss,Itchiness, Flaky skin, Irritated skin, Red skin, treatment',
        treatment:
          'Hair clipping, Medicated shampoo (use weekly), Topical applications which include compounds such as Selamectin, Milbemycin, Ivermectin and Imidacloprid-moxidectin',

      },
      {
        id: 3, name: 'Feline Tapeworms',
        symptoms:
          'Diarrhea, Emaciation, Seizures, Shaggy coat, Loss of appetite, Failure to thrive, Intestinal blockages, Intestinal compliations, Tapeworms in feces',
        treatment:
          'Deworming medication called anthelmintic, Use flea control products to control fleas in the environment.',

      },
      {
        id: 4, name: 'Feline Liver Disease',
        symptoms:
          'Ascites (Swelling of abdomen), Lethargy, Loss of appetite, Increased thrist, Frequent urination, Weight loss, Bleeding disorders, Vomiting, Diarrhea, Yellow skin, Yellow eyes, Yellow gums, Excessive drooling',
        treatment:
          'Reduction in protein intake, Minimize dietary carbohydrate levels, Antibiotics, Liver protectant supplements called SAMe, Ursodiol, Medications that include Espirantel, Praziquantel, and Fenbendazole',

      },
      {
        id: 5, name: 'Feline Mange',
        symptoms:
          'Hairloss,Itchiness, Flaky skin, Irritated skin, Red skin, treatment',
        treatment:
          'Hair clipping, Medicated shampoo (use weekly), Topical applications which include compounds such as Selamectin, Milbemycin, Ivermectin and Imidacloprid-moxidectin',

      },
      {
        id: 6, name: 'Feline Lower Urinary Tract Disease (FLUTD)',
        symptoms:
          'Straining to urinate, Urinating small amounts, Frequent attempts to urinate, Prolonged attempts to urinate, Crying out while urinating, Excessive licking of genital areas, Urinating outside the litter box, Blood in urine, Distress',
        treatment:
          'Feed small meals on a freuquent basis, Provide adequate number of litter boxes with the type of litter that the cat prefer, Provide fresh, clean water at all times, Keep litter boxes in quiet and safe areas of the house, Keep litter boxes clean, Minimize major changes in routine',

      },
      {
        id: 7, name: 'Feline Rabies',
        symptoms:
          'Fever, Lethargy, Loss of appetite, Weakness, Paralysis of hind legs, Seizures, Difficulty breathing, Drooling, Aggression, Depression, Coma, Loss of muscle control, Foaming at mouth, Sudden death',
        treatment:
          'There is no cure or treatment for rabies once symptoms appear. The disease results in death, If your cat interacts with a rabid animal, consult your veterinarian immediately, If you think you have bitten by  rabid animal, consult your doctor immediately, Vaccinate your cat annually to protect it from rabies virus.',
      },
      {
        id: 8, name: 'Canine Lupus',
        symptoms:
          'Anemia,Fever,Lethargy,Loss of appetite,Weight loss,Muscle stiffness,Joint pain,Swelling in joints,Increased thirst,Frequent urination,Ulcer,Twitching,Seizures,Hair loss,Skin color changes,Crusty skin',
        treatment:
          'Topical oinments such as tacrolimus (apply for ten minutes),Topical steroid creams (apply for ten minutes),Antibiotics such as tetracycline,Niacinamide,Immune suppressant such as cyclosporine',
      },
      {
        id: 9, name: 'Canine Impetigo',
        symptoms:
          'Pimple-like lesions,Acne,Rash,Inflamed skin,Pus filled blisters,Hair loss,Crusty skin,Scratching infected areas,Licking infected areas,Biting infected areas,Depression, Weight loss',
        treatment:
          'Pimple-like lesions,Acne,Rash,Inflamed skin,Pus filled blisters,Hair loss,Crusty skin,Scratching infected areas,Licking infected areas,Biting infected areas,Depression,Weight loss',
      },

      {
        id: 10, name: 'Canine Mange',
        symptoms:
          'Hair loss,Irritated skin,Rash,Thick yellow crusts,Bacteria infection,Yeast infection,Itchiness,Thickening of skin,Lymph node inflammation,Emaciation',
        treatment:
          'Hair clipping, Medicated shampoo (Use weekly), Topical applications which include compounds such as Selamectin, Milbemycin, Ivermectin and Imidacloprid-moxidectin',
      },
      {
        id: 11, name: 'Canine Distemper',
        symptoms:
          'Coughing,Dyspnea,Pneumonia,Diarrhea,Vomiting,Purulent nasal discharge,Enamel hypoplasia,Hyperkeratosis,Circling,Head tilt,Nystagmus,Partial paralysis,Complete paralysis,Convulsion,Dementia,Involuntary jerky twitching,Muscles contraction,Convulsion contraction',
        treatment:
          'There is no cure for distemper infection once symptoms appear,Separate infected dogs from other dogs,Vaccinate your dogs annually to prevent the distemper virus.',
      },

      {
        id: 12, name: 'Canine Parvovirus',
        symptoms:
          'Loss of appetite,Abdominal pain,Abdominal bloating,Bloody diarrhea,Diarrhea,Vomiting, Dehydration',
        treatment:
          'Immediately isolate from other pets to prevent the spread of infection,Consult your vetarinarian immediately.',
      },
      {
        id: 13, name: 'Canine Heartworm',
        symptoms:
          'Labored breathing,Coughing,Vomiting,Weight loss,Weakness,Fatigue',
        treatment:
          'Consult your vetarinarian immediately.',
      },
      {
        id: 14, name: 'Canine Rabies',
        symptoms:
          'Restlessness,Aggression,Irritability,Apprehension,Biting,Snapping at any form of stimulus,Licking,Chewing,Fever,Hiding in dark places,Eating unusual objects,Paralysis of throat,Paralysis of jaw muscles,Foaming at mouth,Disorientation,Incoordination,Staggering,Paralysis of hind legs,Loss of appetite,Weakness,Seizures,Sudden death',
        treatment:
          'There is no cure or treatment for rabies once symptoms appear. The disease results in death,If your dog interacts with a rabid animal, consult your veterinarian immediately,If you think you have bitten by  rabid animal, consult your doctor immediately,Vaccinate your dog annually to prevent the rabies virus.',
      }
    ];

    // tableData filter by value
    const filteredTableData = tableData.filter((item) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    }
    );

    return filteredTableData
  }

  getDataFilter(value: any) {
    if (this.selectedPetCategoryName == 'canine') {
      const filteredTableData = value.filter(function (a) {
        return a.toLowerCase().includes('canine');
      });
      return filteredTableData
    } else if (this.selectedPetCategoryName == 'feline') {
      const filteredTableData = value.filter(function (a) {
        return a.toLowerCase().includes('feline');
      });
      return filteredTableData
    }else{
      return []
    }
  }
}
