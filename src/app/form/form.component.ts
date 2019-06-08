import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

function positiveNumber(control: AbstractControl): { [key: string]: boolean } | null {
  // console.log(control.value)

  if ((String(control.value) == '' || String(control.value) == 'null')) {
    return null;
  }
  else if ((isNaN(control.value))) {
    return { 'nan': true };
  }
  else if ((control.value < 10 || control.value > 1000)) {
    return { 'notvalid': true }
  }

  return null;
}

function limitNumber(control: AbstractControl): { [key: string]: boolean } | null {
  if ((String(control.value) == '' || String(control.value) == 'null')) {
    return null;
  }
  else if(isNaN(control.value)){
    control.patchValue('');
  }
  else if (control.value.length != 4) {
    return { 'notvalid': true };
  }

  return null;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form;
  checkValid = [{ count: 0, subtotal: 0, amount: 0 }]
  // amountValid= false;
  totalArray = [];
  netTotal = 0;
  formChanges: Observable<any>
  checkboxes = [
    {
      label: 'C1',
      checked: false,
      key: 'c1'
    },
    {
      label: 'C2',
      checked: false,
      key: 'c2'

    },
    {
      label: 'C3',
      checked: false,
      key: 'c3'

    },
    {
      label: 'C4',
      checked: false,
      key: 'c4'

    },
    {
      label: 'C5',
      checked: false,
      key: 'c5'

    },
    {
      label: 'C6',
      checked: false,
      key: 'c6'

    }
  ];
  amounts = [
    {
      label: 'Amount 1',
      key: 'amount1',
      input: false
    },
    {
      label: 'Amount 2',
      key: 'amount2',
      input: false
    },
    {
      label: 'Amount 3',
      key: 'amount3',
      input: false
    },
    {
      label: 'Amount 4',
      key: 'amount4',
      input: false
    }
  ]
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }


  createForm() {
    this.form = this.fb.group({
      entity: this.fb.array([
        this.fb.group({
          amount1: ['', positiveNumber],
          amount2: ['', positiveNumber],
          amount3: ['', positiveNumber],
          amount4: ['', positiveNumber],
          c1: [''],
          c2: [''],
          c3: [''],
          c4: [''],
          c5: [''],
          c6: [''],
          box: ['',limitNumber]
        })
      ])
    })

    this.formChanges = this.form.valueChanges;

    // this.formChanges.subscribe(res => {
    //   if (res) {
    //     this.subTotal = [];
    //     res.entity.forEach((element, index) => {
    //       let subtotal = 0;
    //       let count = 0;
    //       this.singleEntity.forEach((item, i) => {
    //         if (element[item.currency.key] == true) {
    //           count++;
    //           this.singleEntity[i].currency.checked = true;
    //           subtotal = subtotal + element[item.amount.key];
    //         }
    //         else {
    //           this.singleEntity[i].currency.checked = false;
    //         }
    //       })

    //       let checked = this.singleEntity.filter(item =>{
    //         return (item.currency.checked == true && element[item.amount.key]>0);
    //       })
    //       let average = subtotal/count?subtotal/count:0
    //       this.subTotal[index] = {
    //         amount:average,
    //         valid:checked.length>0?true:false
    //       };

    //       this.netTotal = this.checkTotal('amount');
    //     });

    //     this.checkValid = this.subTotal.filter(one =>{
    //       return one.valid == false;
    //     })
    //   }


    // })


    this.formChanges.subscribe(res => {
      if (res) {
        // console.log(res)
        res.entity.forEach((element, index) => {
          let count = 0;
          let subtotal = 0;
          let amount = 0;
          for (let key in element) {
            if (element[key] == true) {
              count++;
            }
          }
          amount = (element.amount1 ? element.amount1 : 0) + (element.amount2 ? element.amount2 : 0) + (element.amount3 ? element.amount3 : 0) + (element.amount4 ? element.amount4 : 0)
          subtotal = count?(amount) / count:0;
          this.totalArray[index] = {
            amount: amount,
            count: count,
            subTotal: subtotal ? subtotal : 0
          }
        });

        console.log(this.totalArray)

        this.checkTotal(this.totalArray);
      }
    });

  }

  checkTotal(data) {
    this.netTotal =  data.reduce((a, b) => a + (b['subTotal'] || 0), 0);
    this.checkValid = data.filter(item => {
      return (item.amount == 0 || item.count == 0)
    })

    // console.log(this.netTotal,this.checkValid)
  }


  addEntity() {
    let control = <FormArray>this.form.controls.entity;
    control.push(
      this.fb.group({
        amount1: ['', positiveNumber],
        amount2: ['', positiveNumber],
        amount3: ['', positiveNumber],
        amount4: ['', positiveNumber],
        c1: [''],
        c2: [''],
        c3: [''],
        c4: [''],
        c5: [''],
        c6: [''],
        box: ['',limitNumber]
      })
    );
  }
  deleteEntity(index) {
    let control = <FormArray>this.form.controls.entity;
    control.removeAt(index);
  }


  submit(data) {
    console.log(data);
    console.log(this.totalArray, 'data');
  }

}
