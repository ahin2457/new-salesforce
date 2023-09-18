import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
 
export default class FormFill extends LightningElement {
   @api recordId;
   @api objectApiName;
 
   handleSuccess(e) {
        // Close the modal window and display a success toast
        this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회 성공!',
                variant: 'success'
            })
        );
   }
   handleErrors(e) {
    // Close the modal window and display a success toast
    this.dispatchEvent(new CloseActionScreenEvent());
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error',
            message: '에러!',
            variant: 'Error'
        })
    );
}
}