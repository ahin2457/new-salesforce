import { LightningElement, wire } from 'lwc';
import getLeadReportData from '@salesforce/apex/LeadReportController.getLeadReportData';

export default class ReportViewer extends LightningElement {
    leads = [];

    //  method 호출 
    @wire(getLeadReportData)
    wiredAccounts({ error, data }) {
       // data가
        if (data) {
            this.leads = data;
        } else if (error) {
            console.error(error);
        }
    }
}
