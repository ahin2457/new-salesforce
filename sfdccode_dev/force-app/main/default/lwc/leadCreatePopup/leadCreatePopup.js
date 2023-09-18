import { LightningElement, track } from 'lwc';

export default class LeadCreatePopup extends LightningElement {
  @track firstName = '';
  @track lastName = '';

  handleFirstNameChange(event) {
    this.firstName = event.target.value;
  }

  handleLastNameChange(event) {
    this.lastName = event.target.value;
  }

  createLead() {
    // Implement logic to create a new lead using Apex method
    // You'll need to define an Apex method and wire it here
  }
}
