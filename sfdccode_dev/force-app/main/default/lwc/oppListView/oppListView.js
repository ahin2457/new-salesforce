import { LightningElement, track } from 'lwc';
import getOpportunity from '@salesforce/apex/oppListView.getOpportunity';

const Colums = [
    { label: 'oppportunity Name' , fieldName: 'link' , type: 'url' ,typeAttributes: { label: {fieldName:'Name'}}},
    { label: 'Account' , fieldName: 'AccountId', type: 'url', typeAttributes: { label: {fieldName:'AccountId'}}},
    { label: 'Amount' , fieldName:'Amount', type: 'text', type: 'text',typeAttributes: { label: {fieldNmae: 'Amount'}}},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'text', typeAttributes: { label: {fieldName: 'CloseDate'}}},
    { label: 'Stage', fieldName: 'StageName', type: 'text', typeAttributes: {label: {fieldName: 'StageName'}}}
    
]

export default class OppListView extends LightningElement {
    opportunity;
    columns = Colums;
    
    async connectedCallback(){
        await this.viewAll();
    }
    // select opp data
    async viewAll(){
        
        const result = await getOpportunity();
        this.opportunity = result.map(row =>{
            return this.mapOpportunity(row);
        })
    }
    
    // select opp data
    // mapping
    mapOpportunity(row){
        var accountName = '';
        var accountLink = '';
        if(row.AccoutId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }
        return {...row,
            Name: row.Name,
            link: `/${row.Id}`,
            accountLink: accountLink,
            AccountName: accountName
        };
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