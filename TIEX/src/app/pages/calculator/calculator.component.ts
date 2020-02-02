import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { CommonModule, CurrencyPipe} from '@angular/common';

declare var swal:any;
declare var $: any;
declare interface Task {
  title: string;
  checked: boolean;
}
@Component({
    moduleId: module.id,
    selector: 'calculator-cmp',
    templateUrl: 'calculator.component.html'
})



export class calculatorComponent implements OnInit, AfterViewInit{

  constructor(private currencyPipe : CurrencyPipe) {
  }

    showResult:boolean = false;
    LastSendCost:number=0;
    public formModel:InputSimpleModel = new InputSimpleModel();
    ngOnInit(){
        

    }

    ngAfterViewInit(){
        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();
    }


    showNotification(from, align){
      var type = ['','info','success','warning','danger','rose','primary'];

      var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
        icon: "notifications",
        message: "Welcome to <b>Material Dashboard</b> - a beautiful dashboard for every web developer."

      },{
          type: type[color],
          timer: 3000,
          placement: {
              from: from,
              align: align
          }
      });
}

ValidSupplier(){
  debugger
  if(this.formModel.ProductUrl.includes('mercado')){
      this.formModel.IsML = true;
      this.formModel.IsAMA = false;
      this.formModel.IsOther = false;
      
  }
  else if(this.formModel.ProductUrl.includes('amazon')){
    this.formModel.IsML = false;
      this.formModel.IsAMA = true;
      this.formModel.IsOther = false;
}
else{
  this.formModel.IsML = false;
      this.formModel.IsAMA = false;
      this.formModel.IsOther = true;
}

}

EnterCost(){
  this.formModel.SellCost = this.formModel.CostProduct;
  this.EnterSellCost();
}

EnterBuy(){
  this.CalculateOnEnter();
}

EnterSend(){
  debugger;
  if(!this.formModel.IsSendFree){    
    //this.formModel.SellCost = this.formModel.SellCost + this.LastSendCost;;
    //this.formModel.SellCost = this.formModel.SellCost - this.formModel.SendCost;
    this.LastSendCost = this.formModel.SendCost;
  }
  else if(this.formModel.IsSendFree){
    this.LastSendCost = this.formModel.SendCost;
    //this.formModel.SendCost = this.LastSendCost;
    //this.formModel.SellCost = this.formModel.SellCost + this.formModel.SendCost;
  }

  this.CalculateOnEnter();

}

EnterSellCost(){
  debugger
  if(this.formModel.SellCost >=500){
    this.formModel.IsSendFree = true;
    this.LastSendCost = 0;
  }
  else{
    this.formModel.IsSendFree = false;
    this.LastSendCost = this.formModel.SendCost;
    // if(!this.formModel.IsSendFree){
      
    //   this.formModel.SellCost = this.formModel.SellCost - this.formModel.SendCost;
    // }
    // else if(this.formModel.IsSendFree){
    //   this.formModel.SellCost = this.formModel.SellCost + this.formModel.SendCost;
    // }
  }
  this.CalculateOnEnter();
}

IsSendFreeEvent(){
debugger
  if(this.formModel.IsSendFree){
    this.formModel.IsSendFree = false;
    this.LastSendCost = this.formModel.SellCost;
    //this.formModel.SellCost = this.formModel.SellCost - this.formModel.SendCost;
    this.LastSendCost = this.formModel.SendCost;
  }
  else if(!this.formModel.IsSendFree){
    this.formModel.IsSendFree = true;
    this.LastSendCost = this.formModel.SendCost;
    this.formModel.SendCost = this.LastSendCost;
    //this.formModel.SellCost = this.formModel.SellCost + this.formModel.SendCost;
  }

  this.CalculateOnEnter();
  
}

IsML13Event(){
  
}

IsML17Event(){
  
}

handleChange(up) {
  debugger  
  this.formModel.ExtraCost = this.formModel.SellCost 
  this.formModel.SellCost = this.formModel.SellCost + Number(up);
}


transformAmount(element){
  debugger
 //(blur)="transformAmount($event)"
  var xc = this.currencyPipe.transform('56', 'USD',true);
  var newstr = xc.replace('$', ""); 
  this.formModel.CostProduct = Number(newstr);
}

Clean(){
  this.formModel =  new InputSimpleModel();
  return false;
}

Save(){
  swal({
    type: "success",
    title: "Good job!",
    text: "Product saved!",
    buttonsStyling: false,
    background: '#4caf50',
    confirmButtonClass: "btn btn-info"

});
return false;
}

CalculateOnEnter(){
  if(this.showResult){
    this.Calculate();
  }
}

Calculate(isClicked = ''){
  debugger
  if(!this.formModel.IsSendFree)
   this.formModel.GainTotal=(this.formModel.SellCost -this.formModel.BuyCost - this.formModel.SendCost);

  if(this.formModel.IsSendFree)
  this.formModel.GainTotal=(this.formModel.SellCost -this.formModel.BuyCost)

    if(this.formModel.GainTotal > 60){
      this.formModel.IsViable = true;

      if(isClicked === '1')
      $.notify({
        icon: "notifications",
        message: "La ganancia es favorable."

      },{
          type: 'success',
          timer: 3000,
          placement: {
              from: 'top',
              align: 'right'
          }
      });
    }
    
    if(this.formModel.GainTotal < 60){
      this.formModel.IsViable = false;
      if(isClicked === '1')
      $.notify({
        icon: "notifications",
        message: "La ganancia NO es favorable."

      },{
          type: 'danger',
          timer: 3000,
          placement: {
              from: 'top',
              align: 'right'
          }
      });
      
    }   

    this.showResult = true;

}

}


export class InputSimpleModel{
  IsValidForm:boolean = false;
  ProductUrl:string = "";
  IsML:boolean = false;
  IsAMA:boolean = false;
  IsOther:boolean = false;
  CostProduct:number = 0.00;
  BuyCost:number = 0.00;
  SellCost:number = 0.00;
  SendCost:number = 120.00;
  ExtraCost:number = 0.00;
  IsSendFree:boolean = false;
  ML13:boolean = false;
  ML17:boolean = false;
  IsViable:boolean = false;
  GainTotal: number = 0.00;


}