import { Component, Output, EventEmitter, SimpleChanges, Input, OnChanges, AfterViewInit, forwardRef, OnInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Table } from 'primeng/table';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { Plugins, CameraResultType, } from '@capacitor/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { UtilityService } from '../../../services/shared/utility/utility.service';
import { CommonPopupComponent } from '../../common-popup/common-popup.component';
const { Camera } = Plugins;

export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Customer {
  id?: number;
  name?: string;
  country?: Country;
  company?: string;
  date?: string;
  status?: string;
  activity?: number;
  representative?: Representative;
}


@Component({
  selector: 'digital-p-prime-table',
  templateUrl: 'prime-table.component.html',
  styleUrls: ['prime-table.component.scss'],
  providers: [],
})

export class PrimeTable implements OnChanges {
  @ViewChild('dt') table: Table;
  @ViewChildren('fileView') fileView :ElementRef;
  // @ViewChild('fileView') fileView :ElementRef;

  
  @Input() tableData: any[];
  @Input() tableMetaData: any[];
  @Input() tableGlobalFilterFields: any[]; //['name','country.name','representative.name','status']
  @Input() tableTitle: string;
  @Input() tableSelectedValue: any;

  @Input() showActions: boolean = true;
  @Input() showActionsAdd: boolean = false;
  @Input() showActionsEdit: boolean = true;
  @Input() showActionsDelete: boolean = true;
  @Input() showSearchBar: boolean = true;
  @Input() showSerialNumber: boolean = false;
  @Input() showcheckbox: boolean = false; // mutiple select selectbox
  @Input() showRadiobuttonCheckbox: boolean = false; // single select checkbox
  @Input() showTableName: boolean = true;
  @Input() showCustomFilter: boolean = false;
  @Input() showActionsAddLabel :string = '';

  @Input() customFilterData: any[] = [];

  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: any[] = [10, 25, 50];

  @Input() mutipleFileUpload: boolean = false;

  @Input() radioValueSelected: any ;

// added 16-04-2021 
  @Input() showTableEmptyMessage: boolean = false ;
  @Input() showTableBody: boolean = false ;
  @Input() paginator :boolean = false;
  @Input() showCustomSearchFromExistingData :boolean = false;

  @Input() showSearchButton:boolean = true;

//export to csv
  @Input() downloadData :any = [];

  @Input() showSortIcon :boolean =false;

  




  @Output() customSearchClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() customTableDataApiCall: EventEmitter<any> = new EventEmitter<any>();


  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUnSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEdit: EventEmitter<string> = new EventEmitter<any>();
  @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

  @Output() onFileView: EventEmitter<string> = new EventEmitter<any>();
  @Output() onFileUpload: EventEmitter<string> = new EventEmitter<any>();
  @Output() onFileDelete: EventEmitter<string> = new EventEmitter<any>();

  @Output() onMoreDetails: EventEmitter<string> = new EventEmitter<any>();
  @Output() onMoreDetailsTwo: EventEmitter<string> = new EventEmitter<any>();
  @Output() onCancelApplication: EventEmitter<string> = new EventEmitter<any>();

  
@Output() viewFileEvent: EventEmitter<any> = new EventEmitter<any>();

  loading: boolean = false;

  constructor(public appConfigService: AppConfigService,
    public uttility:UtilityService,
    private fileChooser: FileChooser,
    private modalController:ModalController,
    private cd:ChangeDetectorRef

  ) { }

  ngOnInit() {
    // alert("inside primeng")
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // this.data = changes['data'].currentValue;
  }

  edit(col) {
    this.onEdit.emit(col);
  }

  add() {
    let obj = {};
    this.onAdd.emit(obj);

  }

  // custom search

  customInputChange(data, parentData) {
    // if(parentData.inputType != undefined && parentData.inputType == 'number'){
    //     if(parentData.maxlength != undefined){
    //       if (data.target.value.length > 0) {
    //         if(data.target.value.length > parentData.maxlength){
    //           parentData.value = data.target.value.slice(0,parentData.maxlength);
    //           // this.table.cd.detectChanges();
    //           // this.cd.detectChanges();
    //           // setTimeout(() => {
    //             // 
    //           // }, 0);
    //         }else{
    //           parentData.value = data.target.value;
    //         }
    //       } else {
    //         parentData.value = '';
    //       }
    //     }else{
    //       if (data.target.value.length > 0) {
    //         parentData.value = data.target.value;
    //       } else {
    //         parentData.value = '';
    //       }
    //     }
    // }else{
    //   if (data.target.value.length > 0) {
    //     parentData.value = data.target.value;
    //   } else {
    //     parentData.value = '';
    //   }
    // }

    if (data.target.value.length > 0) {
      parentData.value = data.target.value;
    } else {
      parentData.value = '';
    }

  }

  customSearch() {
    console.log("clicked search of custom");
    this.tableSelectedValue = null;
    this.customSearchClicked.emit(true);
    // add date filter logic check accordingly

    if(this.showCustomSearchFromExistingData){ // table data already present
    this.showTableEmptyMessage = true;
      console.log("inside EXSISTING TABLE DATA CUSTOM SEARCH logic");
      var filterUsedWithValues = false;
      this.customFilterData.forEach(element => {
        if (element.value != null && element.value != "") {
          console.log("filter data with -->" + element.value + "---for field---" + element.tableMetaDataField)
          filterUsedWithValues = true;
          this.table.filter(element.value, element.tableMetaDataField, 'startsWith');
        }
      });
      if (!filterUsedWithValues) {
        console.log("FILTER GLOBAL ----")
        this.table.reset();
        // clearState()
      }
      // check paginator
      console.log("check paginator---"+this.tableData.length);
      if(this.tableData.length > 0){
        this.showTableBodyContent();
        this.showPaginator();
      }else{
        this.hideTableBodyContent();
        this.hidePaginator();
      }
    }else{ // emit to parent to call api
      this.hideTableBodyContent();
      this.hidePaginator();
      this.showTableEmptyMessage = false;
      console.log("  showTableEmptyMessage$$$$$$$$$$$$$$$$$$$$$$$$  "+this.showTableEmptyMessage);

      console.log("inside API CUSTOM SEARCH logic");
      let obj :any = {};
      obj.customFilterData = this.customFilterData;
      obj.sortedCustomFilterData = [];


      this.customFilterData.forEach(element => {
        if (element.value != null && element.value != "") {
          let innerObj :any = {};
          innerObj.value = element.value;
          innerObj.tableMetaDataField = element.tableMetaDataField;

          obj.sortedCustomFilterData.push(innerObj)
        }
        });

        if(obj.sortedCustomFilterData.length > 0){
          console.log("EMIT data to PARENT for CUSTOM API SEARCH FROM API");
          this.customTableDataApiCall.emit(obj);
        }else{
          this.showTableEmptyMessage = true;
          this.tableData = [];
          console.log("custom API search clicked but all values are empty - DONOT EMIT to PARENT");
        }
    }
   
   
  }

  customClear() {
    // this.customFilterData.forEach(element => {
    //   element.value = '';
    // });
    this.table.reset();
  }

  onLinkClick(event,data) {
    if (event) {
      console.log("stop propogation");
      event.stopPropagation();
    }
    console.log("link clicked " + JSON.stringify(data));
    this.onSelect.emit(data)
  }

  onRowSelect(data) {
    console.log("onRowSelect" + JSON.stringify(data));
    this.onSelect.emit(data);
  }

  onRowUnselect(data) {
    console.log("onRowUnselect " + JSON.stringify(data));
    this.onUnSelect.emit(data);
  }

  onFileViewClk(rowData,rowDataField) {
    // this.onFileView.emit(rowData);

    // this.viewFile(rowData,rowDataField); // showing first time file upload

    if(rowData.dmsDocRefId != null && rowData.dmsDocRefId != ""){
      let obj :any = {};
      obj.rowData = rowData;
      obj.rowDataField = rowDataField;

      this.viewFileEvent.emit(obj);
    }else{
      alert("dms uploaded file reference id not present");
    }
  }

  onInputFileUpload(files, rowData, rowDataField, index) {
    console.log("---file changed---" + files)
    console.log("---rowData changed---" + rowData)
    console.log("---rowDataField changed---" + rowDataField)
    console.log("---file content---" + files.target.files[0]);
    // lastModified: 1616396828201
    // lastModifiedDate: Mon Mar 22 2021 12:37:08 GMT+0530 (India Standard Time) {}
    // name: "111.jpg"
    // size: 39004
    // type: "image/jpeg"
    if (!rowDataField.singleSelect) {
      //pending
      // this.onFileUpload.emit();
      rowDataField.actionsView = true;
      rowDataField.actionsDelete = true;
      rowDataField.isFileSelected = true;
    } else {
      rowData.docValue = files.target.files[0];

      var file:File = files.target.files[0];
    var myReader:FileReader = new FileReader();

    var base64StringFull = null;

    myReader.onloadend = (e) => {
      base64StringFull = myReader.result;
      rowDataField.base64StringFull = myReader.result;
      console.log("base64String FULL==> "+rowDataField.base64StringFull);


      var base64StringShort = '';
      var commaPosition = null;
  
      commaPosition = base64StringFull.indexOf(",");
      base64StringShort = base64StringFull.substring(commaPosition+1,base64StringFull.length);
  
      rowDataField.base64String = base64StringShort;
  
      console.log("base64 SHORT ==> "+rowDataField.base64String);

      
      rowDataField.mimeType = files.target.files[0].type;
      rowDataField.fileName = files.target.files[0].name;
      rowDataField.actionsView = true;
      rowDataField.actionsDelete = true;
      rowDataField.isFileSelected = true;
      console.log("mimeType ==> "+rowDataField.mimeType);
      console.log("fileName==> "+rowDataField.fileName);
    console.log("--- before emiting docValue---" + rowData.docValue);
    console.log("--- before emiting docValue---" + rowDataField);

    // console.log("fileView "+this.fileView);

    // this.fileView.nativeElement.value = '';
    // this.fileView['_results'][this.stepperIndex]
    // console.log("fileView "+this.fileView);
    // this.fileView['_results'][index].nativeElement.value = '';


      this.onFileUpload.emit(rowData);
     
    }
    myReader.readAsDataURL(file);

 
    }
  }

  onFileDeleteClk(rowData, rowDataField) {
    rowData.docValue = null;

   
    rowDataField.actionsView = false;
    rowDataField.actionsDelete = false;
    rowDataField.isFileSelected = false;
    rowDataField.fileName = null;
    rowDataField.base64String = null;
    rowDataField.base64StringFull = null;
    rowDataField.mimeType = null;
    this.onFileDelete.emit(rowData)
  }

  showPaginator(){
    this.paginator = true;
    }
    hidePaginator(){
      this.paginator = false;
    }

    showTableBodyContent(){
      this.showTableBody = true;
    }
  
    hideTableBodyContent(){
      this.showTableBody = false;
    }

    async onFileClick(){
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
      //   this.imagee = 'data:image/jpeg;base64,' + image.base64String;
  }

  moreDetailsClk(data){
    console.log("data",data)
    this.onMoreDetails.emit(data);
  }
  moreDetailsClkTwo(data){
    console.log("data",data)
    this.onMoreDetailsTwo.emit(data);
  }
  cancelApplication(data){
    console.log("data",data)
    this.onCancelApplication.emit(data);
  }

  //eports fuctions
  exportExcel() {
    this.uttility.showLoader();
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.downloadData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "products");

    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });

    this.uttility.hideLoader();
  }

  viewFile(rowData,rowDataField){
    this.documentViewer(rowData,rowDataField)
  }

  documentViewer(rowData,rowDataField){
    let fileObj :any = {};
    fileObj.base64String = rowDataField.base64String;
    fileObj.base64StringFull = rowDataField.base64StringFull;
    fileObj.mimeType = rowDataField.mimeType;
    fileObj.fileName = rowDataField.fileName;

console.log("let base64String "+fileObj.base64String);
console.log("let mimeType "+fileObj.mimeType);

    if(this.appConfigService.getPlatformMobile()){
    // this.forMobile();
    }else{
    
    this.forWeb(fileObj);
    }
    }

    forWeb(fileObj){
      if(fileObj.mimeType == 'application/pdf'){
        fileObj.showImageViewer = false; // used in common component of popup to identify file type condition

      let byteCharacters= atob(fileObj.base64String);
      var byteNumbers=new Array(byteCharacters.length);
      for(var i=0;i<byteCharacters.length;i++){
      byteNumbers[i]=byteCharacters.charCodeAt(i);
      }
      var byteArray=new Uint8Array(byteNumbers);
      var file=new Blob([byteArray],{type:'application/pdf;base64'});
      var fileURL=URL.createObjectURL(file);
      window.open(fileURL);
      }else{
      this.openImagePopover(fileObj);
      }
      }

      async openImagePopover(fileObj){
        fileObj.showImageViewer = true; // used in common component of popup to identify file type
        let title = 'View Image';

        const popover = await this.modalController.create({
        component:CommonPopupComponent,
        componentProps:{
        data:fileObj,
        title:title
        },
        backdropDismiss:false,
        });
        await popover.present();
        }

    // forMobile(){
    //   if(this.popoverData.mimeType=='application/pdf'){
    //   this.pdfService.openPdf(this.popoverData.base64,this.popoverData.documentName,this.popoverData.mimetype);
    //   }else{
    //   this.openImagePopover();
    //   }
    //   }

}



// added pagination logic
// show hide body logic
// custom search from existing data and api calling filter data logic



//https://stackblitz.com/edit/primeng-tabledoc-demo?file=src%2Fapp%2Fapp.component.ts
