import { Component, Output, EventEmitter, SimpleChanges,Input, OnChanges, AfterViewInit,forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Component({
  selector: 'digital-cs-radio-button-layout-1',
  templateUrl: 'radio-button-layout-1.page.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonLayout1Page),
      multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => RadioButtonLayout1Page),
        multi: true,
      }
  ],
  styleUrls: ['radio-button-layout-1.page.scss'],
})
export class RadioButtonLayout1Page implements OnChanges {
  @Input() data: any;
  @Input() required:boolean=false;
  @Output() onItemClick = new EventEmitter();
  @Input() selectedItem: any;
  @Input() title: any;  
  @Input() showTitle:boolean = true;
  @Input() bluelabelbool:boolean=false;
  @Input() readonly :boolean = false;
  @Input() readOnlyHeight:any;

  constructor() { }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // if(changes['data'] == undefined){
    //   this.selectedItem = changes.selectedItem.currentValue;
    // }else{
    //   this.data = changes['data'].currentValue;
    // }
  }

  private propagateChange = (_: any) => { };
  
  writeValue(obj: any): void {
     // this.selectedDate = obj;
  }
  registerOnChange(fn: any): void {
      this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
      //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
      //throw new Error("Method not implemented.");
  }
  validate(c: AbstractControl): { [key: string]: any; } {
    // alert("inside radio");    
      if(this.required && (this.selectedItem == null || this.selectedItem == "") ){
        // alert("radio error");
          return {
              "radio" :{valid:false}
          }
      }else{
        // alert("radio clearr");        
          return null;
      }
  }
  registerOnValidatorChange?(fn: () => void): void {
     // throw new Error("Method not implemented.");
  }

  onItemClickFunc(item,event): void {
    console.log("child radio selectedItem---------"+this.selectedItem); 
    this.selectedItem = item.value;   
    this.propagateChange(this.selectedItem);
    console.log("child radio data before emiting---------"+JSON.stringify(item));
    this.onItemClick.emit(item);
  }

  setSelectedItem(val){
    this.selectedItem = val;
  }
}
