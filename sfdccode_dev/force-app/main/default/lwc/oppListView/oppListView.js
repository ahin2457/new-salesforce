import { LightningElement, track } from 'lwc';
import getOpportunity from '@salesforce/apex/oppListView.getOpportunity';
import searchOpp from '@salesforce/apex/oppListView.searchOpp';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import recentView from '@salesforce/apex/oppListView.recentView';


const Colums = [
    { label: 'oppportunity Name' , fieldName: 'link' , type: 'url' ,typeAttributes: { label: {fieldName:'Name'}}},
    { label: 'Account' , fieldName: 'AccountId', type: 'url', typeAttributes: { label: {fieldName:'AccountId'}}},
    { label: 'Amount' , fieldName:'Amount', type: 'text', type: 'text',typeAttributes: { label: {fieldNmae: 'Amount'}}},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'text', typeAttributes: { label: {fieldName: 'CloseDate'}}},
    { label: 'Stage', fieldName: 'StageName', type: 'text', typeAttributes: {label: {fieldName: 'StageName'}}}
    
]

export default class OppListView extends LightningElement {
    @track isShowModal = false;

    opportunity;
    columns = Colums;
    selectedOpps;
    value = 'All';
    
    // 필터 목록 데이터
    get options(){
        return [
            { label:'All' , value: 'All'},
            { label:'Recently', value: 'recent'}
        ];
    }

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

    // select recent data (filter)
    async viewRecent(){
        const result = await recentView();
        this.opportunity = result.map(row =>{
            return this.mapOpportunity(row);
        })
    }


    // All, recently 필터 select
    async handleChange(event){
        if(event.target.value == 'All'){
            await this.viewAll();
            console.log(viewAll());
        }else if(event.target.value == 'recent'){
            await this.viewRecent();
            console.log(viewRecent());
        }
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

    // modeal창 열기 
    showModalBox(){
        this.isShowModal = true;
    }

    // modal창 닫기
    closeModalBox(){
        this.isShowModal = false;
   }

   // 저장 알림
   handleSuccess(event){

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Sucess',
                message: '기회가 성공적으로 저장되었습니다!',
                variant: 'Success'
            })
        );

        this.closeModalBox(event);
        this.handleClose(event);
   }

   // 새로고침
   handleClose(){
    window.location.reload();
   }
    
   
  

}