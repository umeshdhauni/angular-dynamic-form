import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

function positiveNumber(control: AbstractControl): { [key: string]: boolean } | null {
  if ((String(control.value) == '' || String(control.value) == 'null')) {
    return null;
  }
  else if ((isNaN(control.value))) {
    return { 'nan': true };
  }
  // else if(String(control.value)[control.value-1] == '.'){
  //   console.log('hey')
  // }
  else if ((control.value < 10 || control.value > 1000)) {
    return { 'notvalid': true }
  }

  return null;
}

function limitNumber(control: AbstractControl): { [key: string]: boolean } | null {
  if ((String(control.value) == '' || String(control.value) == 'null')) {
    return { 'require': true };
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
          c1: [false],
          c2: [false],
          c3: [false],
          c4: [false],
          c5: [false],
          c6: [false],
          box: ['',limitNumber],
          subTotal:['']
        })
      ])
    })

    this.formChanges = this.form.valueChanges;


    this.formChanges.subscribe(res => {
      if (res) {
        res.entity.forEach((element, index) => {
          let count = 0;
          let subtotal = 0;
          let amount = 0;
          for (let key in element) {
            if(key != 'box'){
              if (element[key] == true) {
                console.log(key)
                count++;
              }
            }
          }
          amount = (element.amount1 ? element.amount1 : 0) + (element.amount2 ? element.amount2 : 0) + (element.amount3 ? element.amount3 : 0) + (element.amount4 ? element.amount4 : 0)
          subtotal = count?(amount) * count:0;
          this.form.controls['entity']['controls'][index]['controls']['subTotal'].setValue(subtotal,{emitEvent: false});
        });

        this.checkTotal(this.form.value.entity);
      }
    });

  }

  checkTotal(data) {
    console.log(data);
    this.netTotal =  data.reduce((a, b) => a + (b['subTotal'] || 0), 0);
    this.checkValid = data.filter(item => {
      return (item.subTotal == 0)
    })
  }


  addEntity() {
    let control = <FormArray>this.form.controls.entity;
    control.push(
      this.fb.group({
        amount1: ['', positiveNumber],
        amount2: ['', positiveNumber],
        amount3: ['', positiveNumber],
        amount4: ['', positiveNumber],
        c1: [false],
        c2: [false],
        c3: [false],
        c4: [false],
        c5: [false],
        c6: [false],
        box: ['',limitNumber],
        subTotal:['']
      })
    );
  }
  deleteEntity(index) {
    let control = <FormArray>this.form.controls.entity;
    control.removeAt(index);
  }


  submit(data) {
    console.log(data);
  }

}
