import { LightningElement, track } from 'lwc';
import getOpportunity from '@salesforce/apex/oppListView.getOpportunity';
import searchOpp from '@salesforce/apex/oppListView.searchOpp';


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
    selectedOpps;
    
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
        this.selectedOpps = event.detail.selectedRows;
    }

    get selectedContacts(){
        if(this.selectedOpps == undefined) return 0;
        return this.selectedOpps.length
    }
    
    // search
    async handleOppSearch(event){
        if(!event.target.value){
            await this.viewAll();
        }else if(event.target.value.length > 1){
            const searchOpps = await searchOpp({searchString: event.target.value})
            
            this.opportunity = searchOpps.map(row => {
                return this.mapOpportunity(row);
            });
        }
    }

   
    
    

}