import { LightningElement, api, track, wire  } from 'lwc';
import getLeadData from '@salesforce/apex/LeadController.getLeadData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RefreshEvent } from "lightning/refresh";
import { getPicklistValues } from 'lightning/uiObjectInfoApi';


 
const columns = [
    { label: '이름', fieldName: 'LeadName', type: 'url',  typeAttributes: { label: {fieldName: 'Name'}, target: '__blank'} },
    { label: '회사',  fieldName: 'Company', type: 'text', typeAttributes: { label: {fieldName: 'Company'}, target: '__blank'} },
    { label: '이메일', fieldName: 'Email', type: 'text', typeAttributes: { label: {fieldName: 'Email'}, target: '__blank'} },
    { label: '상태', fieldName: 'Status', type: 'text', typeAttributes: { label: {fieldName: 'Status'}, target: '__blank'} },
    { label: '등급', fieldName: 'Rating', type: 'text', typeAttributes: { label: {fieldName: 'Rating'}, target: '__blank'} },
];

export default class leadListView extends LightningElement {
    @track data;
    @track searchString;
    @track initialRecords;
    @track records;
    @track isShowModal = false;
   
    availableLeads;
    error;
    columns = columns;
    isLeadavailable=false;
    value = '';


    @wire(getLeadData)
    wiredLeads( { error, data } ) {
       
        if (data) {

            let tempRecs = [];
            data.forEach((record) => {
                let tempRec = Object.assign( {}, record );
                tempRec.LeadName = '/' + tempRec.Id;
                tempRec.Name = record.Name;
              
                tempRecs.push(tempRec);


            });

            this.initialRecords = tempRecs;
            this.availableLeads = tempRecs;
            this.error = undefined;

        } else if (error) {

            //console.error(error);
            this.error = error;
            this.availableLeads = undefined;
        }
    }
    


    handleLeadSearch(event) {
        const searchKey = event.target.value.toLowerCase();

        if(searchKey) {
            this.searchData = this.initialRecords;

            if(this.searchData) {
                let searchRecords = [];

                for (let record of this.searchData) {
                    let valuesArray = Object.values(record);

                    for(let val of valuesArray) {
                        
                        console.log('val is' + val);
                        let strVal = String(val);

                        if(strVal) {

                            if(strVal.toLowerCase().includes(searchKey)){
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
                console.log('매치된 계정은 ' + JSON.stringify(searchRecords));
                this.searchData = searchRecords;
                this.availableLeads = this.searchData;

            }
        } else {
            this.searchData = this.initialRecords;
            this.availableLeads = this.searchData;
        }
    }
    

    
   



    showModalBox() {  
        this.isShowModal = true;
    }

    closeModalBox() {  
        this.isShowModal = false;
    }

    // handleRefresh() {
    //     this.dispatchEvent(new RefreshEvent());
    //   }
     
    handleClose = () => {
        window.location.reload();
    };

    handleSuccess(event) {
     
        // const evt = new ShowToastEvent({
        //     title: 'Lead Updated',
        //     message: '리드가 만들어졌습니다.',
        //     variant: 'success',

        // });
        
        // this.dispatchEvent(evt);
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '리드가 성공적으로 저장되었습니다!',
                variant: 'success'
            })
        );

        this.closeModalBox(event);
        this.handleClose(event);

    }
    
  
    
}