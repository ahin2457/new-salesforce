import { LightningElement, track } from 'lwc';
import getOpportunity from '@salesforce/apex/oppListView.getOpportunity';

const Colums = [
    { label: 'oppportunity Name' , fieldName: 'Name' , type: 'url' ,typeAttributes: { label: {fieldName:'Name'}, target:'__blank'}},
    { label: 'Account Name' , fieldName: 'AccountName', type: 'text', typeAttributes: { label: {fieldName:'AccountName'}, target: '__blank'}},
    { label: 'Amount' , fieldName:'Amount', type: 'text', type: 'text',typeAttributes: { label: {fieldNmae: 'Amount'},  target:'__blank'}},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'text', typeAttributes: { label: {fieldName: 'ClseDate'}, target:'__blank'}},
    { label: 'stage', fieldName: 'stage', type: 'text', typeAttributes: {label: {fieldName: 'stage'}, target:'__blank'}}
]

export default class OppListView extends LightningElement {
    @track data;
    opportunity;
    colums = Colums;
    
    async viewAll(){
        
        const result = await getOpportunity();
        this.opportunity = result.map(row =>{
            return this.mapOpportunity
        })
    }
    
    mapOpportunity(row){
        var 
    }


    handleRowSelection(event){
        this.selectedContacts = event.detail.selectedRows;
    }

    get selectedContacts(){
        if(this.selectedContacts == undefined) return 0;
        return this.selectedContacts.length
    }

    handleOppSearch(event){
        const searchKey = event.target.value.toLowerCase();

        if(searchKey){
            this.searchData = this.initialRecords;

            if(this.searchData) {
                let searchRecords = [];

                for(let record of this.searchData) {
                    let valuesArray = Object.values(record);

                    for(let val of valuesArray) {
                        let strVal = String(val);

                        if(strVal) {
                            if(strVal.toLowerCase().includes(searchKey)){
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
                this.searchData = searchRecords;
                this.availableLeads = this.searchData;
            }
        }else {
            this.searchData = this.initialRecords;
            this.availableLeads = this.searchData;
        }
    }
    
    

}