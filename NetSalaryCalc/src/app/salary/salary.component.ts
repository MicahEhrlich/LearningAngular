import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  incomeTaxLevels = [6310, 9050, 14530, 20200, 42030, 0];
  incomeTaxRates = [0.1, 0.14, 0.20, 0.31, 0.35, 0.47];

  socialSecurityLevel = 6164;
  socialSecurityRate = [0.004, 0.07];

  healthTaxLevel = 6164;
  healthTaxRate = [0.031, 0.05];

  taxPoint = 218;

  profileForm: FormGroup;



  netPay = new FormControl({ value: '', disabled: true });
  incomeTax = new FormControl({ value: '', disabled: true });
  socialSecurity = new FormControl({ value: '', disabled: true });
  healthTax = new FormControl({ value: '', disabled: true });
  pension = new FormControl({ value: '', disabled: true });
  investmentFund = new FormControl({ value: '', disabled: true });

  constructor() { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      basePay: new FormControl(''),
      pension: new FormControl(''),
      investmentFund: new FormControl(''),
    });
    this.onChanges();
  }

  onChanges() {
    this.profileForm.valueChanges.subscribe(val => {
      this.onSubmit();
    });
  }


  onSubmit() {
    // TODO: Use EventEmitter with form value
    let incomeTax = this.calcIncomeTax();
    let socialSecurity = this.calcSocialSecurity();
    let healthTax = this.calcHealthTax();
    let investmentFund = this.calcInvestmentFund();
    let pension = this.calcPension();

    this.incomeTax.setValue(incomeTax);
    this.socialSecurity.setValue(socialSecurity);
    this.healthTax.setValue(healthTax);
    this.investmentFund.setValue(investmentFund);
    this.pension.setValue(pension);
    this.netPay.setValue(this.profileForm.value.basePay - incomeTax - socialSecurity - healthTax - investmentFund - pension);
  }

  calcIncomeTax() {
    console.warn(this.profileForm.value);
    let basePay = this.profileForm.value.basePay;
    let incomeTax = (this.incomeTaxRates[0] * this.incomeTaxLevels[0]) - this.taxPoint * 2.25;
    if (basePay < this.incomeTaxLevels[0]) {
      incomeTax = this.incomeTaxRates[0] * basePay - this.taxPoint * 2.25;
      return incomeTax;
    }

    let i = 1;
    for (i = 1; basePay > this.incomeTaxLevels[i] && i < 5; i++) {
      incomeTax += (this.incomeTaxLevels[i] - this.incomeTaxLevels[i - 1]) * this.incomeTaxRates[i];
    }

    incomeTax += (basePay - this.incomeTaxLevels[i - 1]) * this.incomeTaxRates[i];
    let test = incomeTax.toFixed(2);
    incomeTax = Number(test);
    return incomeTax;
  }

  calcSocialSecurity() {
    let basePay = this.profileForm.value.basePay;
    let socialSecurity = 0;
    basePay > this.socialSecurityLevel ? socialSecurity = this.socialSecurityRate[0] * this.socialSecurityLevel : socialSecurity = this.socialSecurityRate[0] * basePay;
    basePay > this.socialSecurityLevel ? socialSecurity += (basePay - this.socialSecurityLevel) * this.socialSecurityRate[1] : socialSecurity;
    let test = socialSecurity.toFixed(2);
    return Number(test);
  }

  calcHealthTax() {
    let basePay = this.profileForm.value.basePay;
    let healthTax = 0;
    basePay > this.healthTaxLevel ? healthTax = this.healthTaxRate[0] * this.healthTaxLevel : healthTax = this.healthTaxRate[0] * basePay;
    basePay > this.healthTaxLevel ? healthTax += (basePay - this.healthTaxLevel) * this.healthTaxRate[1] : healthTax;
    let test = healthTax.toFixed(2);
    return Number(test);
  }

  calcInvestmentFund() {
    let basePay = this.profileForm.value.basePay;
    let investmentFund = this.profileForm.value.investmentFund;
    let res;
    investmentFund > 0 ? res = (basePay * (investmentFund) / 100).toFixed(2) : res = 0;
    return Number(res);
  }

  calcPension() {
    let basePay = this.profileForm.value.basePay;
    let pension = this.profileForm.value.pension;
    let res;
    pension > 0 ? res = (basePay * (pension / 100)).toFixed(2) : res = 0;
    return Number(res);
  }

}
