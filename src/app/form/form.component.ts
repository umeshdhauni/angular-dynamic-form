import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

function positiveNumber(control: AbstractControl): { [key: string]: boolean } | null {
  console.log(control.value)

  if ((String(control.value) == '' || String(control.value) == 'null')) {
    return null;
  }
  else if ((isNaN(control.value))) {
    return { 'nan': true };
  }
  else if ((control.value < 10 || control.value > 1000 )) {
    return { 'notvalid': true }
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
  checkValid=[{amount:0,valid:false}]
  // amountValid= false;
  subTotal = [];
  netTotal = 0;
  formChanges: Observable<any>
  singleEntity = [
    {
      amount: {
        name: 'Amount 1',
        key: 'amount1',
        disable: true
      },
      currency: {
        name: 'C1',
        key: 'c1',
        checked: false
      }
    },
    {
      amount: {
        name: 'Amount 2',
        key: 'amount2',
        disable: true

      },
      currency: {
        name: 'C2',
        key: 'c2',
        checked: false
      }
    },
    {
      amount: {
        name: 'Amount 3',
        key: 'amount3',
        disable: true

      },
      currency: {
        name: 'C3',
        key: 'c3',
        checked: false
      }
    },
    {
      amount: {
        name: 'Amount 4',
        key: 'amount4',
        disable: true

      },
      currency: {
        name: 'C4',
        key: 'c4',
        checked: false
      }
    },
    {
      amount: {
        name: 'Amount 5',
        key: 'amount5',
        disable: true

      },
      currency: {
        name: 'C5',
        key: 'c5',
        checked: false
      }
    },
    {
      amount: {
        name: 'Amount 6',
        key: 'amount6',
        disable: true

      },
      currency: {
        name: 'C6',
        key: 'c6',
        checked: false
      }
    },

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
          amount5: ['', positiveNumber],
          amount6: ['', positiveNumber],
          c1: [''],
          c2: [''],
          c3: [''],
          c4: [''],
          c5: [''],
          c6: [''],
          subTotal: ['']
        })
      ])
    })

    this.formChanges = this.form.valueChanges;

    this.formChanges.subscribe(res => {
      if (res) {
        // console.log(res);
        this.subTotal = [];
        res.entity.forEach((element, index) => {
          let subtotal = 0;
          let count = 0;
          this.singleEntity.forEach((item, i) => {
            if (element[item.currency.key] == true) {
              count++;
              this.singleEntity[i].currency.checked = true;
              subtotal = subtotal + element[item.amount.key];
            }
            else {
              this.singleEntity[i].currency.checked = false;
            }
          })

          let checked = this.singleEntity.filter(item =>{
            return (item.currency.checked == true && element[item.amount.key]>0);
          })
          let average = subtotal/count?subtotal/count:0
          this.subTotal[index] = {
            amount:average,
            valid:checked.length>0?true:false
          };

          this.netTotal = this.checkTotal('amount');
          // this.netTotal = this.subTotal.reduce((a, b) => a.amount + b.amount, 0) ? this.subTotal.reduce((a, b) => a.amount + b.amount, 0) : 0
        });

        this.checkValid = this.subTotal.filter(one =>{
          return one.valid == false;
        })
      }
      

    })

  }

  checkTotal(key){
    return this.subTotal.reduce((a, b) => a + (b[key] || 0), 0);
  }

  addEntity() {
    let control = <FormArray>this.form.controls.entity;
    control.push(
      this.fb.group({
        amount1: ['', positiveNumber],
        amount2: ['', positiveNumber],
        amount3: ['', positiveNumber],
        amount4: ['', positiveNumber],
        amount5: ['', positiveNumber],
        amount6: ['', positiveNumber],
        c1: [''],
        c2: [''],
        c3: [''],
        c4: [''],
        c5: [''],
        c6: [''],
        subTotal: ['']
      })
    );
  }
  deleteEntity(index) {
    let control = <FormArray>this.form.controls.entity;
    control.removeAt(index);
  }


  submit(data){
    console.log(data);
    console.log(this.subTotal,'data');
  }

}
