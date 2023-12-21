import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'projects/material/src/public-api';

@Component({
  selector: 'app-paypal-dialog',
  imports: [MaterialModule, CommonModule],
  standalone: true,
  template: `
    <mat-card
      style=" background-color: #2d3436 !important;
        color: white !important; display:block; margin:0px auto;border-radius: 0px;width:410px; height:420px"
    >
      <div style="display: flex;justify-content: flex-end;">
        <button mat-icon-button aria-label="close dialog" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <h3 class="mat-color">Request Content</h3>
      <h5 class="mat-color mat-content">
        Describe what type of content do you want your Creator to make and
        choose how much would you pay.
      </h5>

      <div>
        <label class="ml-15">Write a message</label>
        <div class="mat-color mat-content">
          <mat-form-field appearance="outline" class="w-8">
            <mat-label>Message</mat-label>
            <textarea
              matInput
              placeholder="Describe the content you want specially 
for yourself."
            ></textarea>
          </mat-form-field>
        </div>
      </div>

      <!-- <div>
        <label class="ml-15">Choose Amount</label>
        <div class="mat-color mat-content">
          <mat-form-field appearance="outline" class="w-8">
            <mat-label>Custom Amount</mat-label>
            <input matInput placeholder="amount" />
          </mat-form-field>
        </div>
      </div> -->

      <mat-card-actions>
        <button mat-raised-button class="mat-button" color="primary">
          Pay with <b><i>PayPal</i></b>
        </button></mat-card-actions
      >

      <!-- <button
        mat-raised-button
        class="mat-button m-t-5"
        style="background-color:#0a0a0a; border-radius:15px; color:white; "
      >
        <b> Debit</b> or <b>Credit Card</b>
      </button> -->

      <h4 class="mat-color">
        Powered by <b><i>PayPal</i></b>
      </h4>
      <label class="m-b-10"></label>
    </mat-card>
  `,
  styles: [
    '.mat-color{color:white; justify-content:center; text-align:center} .ml-15{margin-left:15%} .w-8{width:80%} .mat-content{padding: 0px 20px ;line-height:1.2} .mat-button{ background-color:"#006baa";display:block;margin:0px auto}',
  ],
})
export class PaypalDialogComponent {}
