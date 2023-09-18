import { LightningElement, wire } from 'lwc';
import getAccountReportData from '@salesforce/apex/AccountReportController.getAccountReportData';

export default class ReportViewer extends LightningElement {
    accounts = [];

    //  method 호출 
    @wire(getAccountReportData)
    wiredAccounts({ error, data }) {
       // data가
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error(error);
        }
    }
}
