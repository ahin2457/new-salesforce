import { LightningElement, track, wire } from 'lwc';
import recentView from '@salesforce/apex/contactListViewHelper.recentView';
import getContacts from "@salesforce/apex/contactListViewHelper.getContacts"
import searchContact from "@salesforce/apex/contactListViewHelper.searchContact"
import deleteContacts from "@salesforce/apex/contactListViewHelper.deleteContacts"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const ACTIONS = [{label:'edit', name: 'edit'},
                {label: 'Delete', name: 'delete'}]

const COLS = [{ label: 'Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'FullName'}}},
              { label: 'Email', fieldName: 'Email'},
              { label: 'Account', fieldName: "accountLink", type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
              { label: "Mailing Address", fieldName: 'MailingAddress'},
              { fieldName: "actions", type: 'action', typeAttributes: {rowActions: ACTIONS}}
]

export default class ContactListView extends NavigationMixin(LightningElement) {
    @track isShowModal = false;

    cols = COLS;
    contacts;
    wiredContacts;
    selectedContacts;
    baseData;
    value = 'All';

    get options() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Recently', value: 'recent' }
        ];
    }

    handleRowSelection(event){
        this.selectedContacts = event.detail.selectedRows;
    }

    get selectedContactsLen() {
        if(this.selectedContacts == undefined) return 0;
        return this.selectedContacts.length
    }

    
    async viewAll(){
        const result = await getContacts();
        this.contacts = result.map(row =>{
            return this.mapContacts(row);
        })
    }
  
    async viewRecent(){
        const result = await recentView();
        this.contacts = result.map(row =>{
            return this.mapContacts(row);
        })
    }
    
    async connectedCallback(){
        await this.viewAll();
    }

    async handleChange(event){
    
        if(event.target.value == 'All'){
            await this.viewAll();
        }else if(event.target.value =='recent'){
            await this.viewRecent();
        }
  }
    mapContacts(row){
        var accountName = '';
        var accountLink = '';
        if(row.AccountId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }

        var street = row.MailingStreet
        if(row.MailingStreet == undefined){
            street = ''
        }
        var city = row.MailingCity
        if(row.MailingCity == undefined){
            city = ''
        }
        var state = row.MailingState 
        if(row.MailingState == undefined){
            state = ''
        }
        var country = row.MailingCountry 
        if(row.MailingCountry == undefined){
            country = ''
        }
        var zipCode = row.MailingPostalCode
        if(row.MailingPostalCode == undefined){
            zipCode = ''
        }

        return {...row,
            FullName: `${row.FirstName} ${row.LastName}`,
            link: `/${row.Id}`,
            accountLink: accountLink,
            AccountName: accountName,
            MailingAddress: `${street} ${city} ${state} ${zipCode} ${country}`
        };
    }

   
    // search
    async handleSearch(event){
        if(!event.target.value){
            await this.viewAll();
        }else if(event.target.value.length > 1){
            const searchContacts = await searchContact({searchString: event.target.value})

            this.contacts = searchContacts.map(row => {
                return this.mapContacts(row);
            })
        }
    }

    // New Contact  모달창 불러오기
    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            }
        });
    }

    // modal 닫기 버튼
    closeModalBox(){
        this.isShowModal = false;
    }

    // New 버튼 onclick 이벤트 모달 창 띄우기
    showModalBox(){
        this.isShowModal = true;
    }
    
    // reload
    handleClose = () => {
        window.location.reload();
    }

    // 저장 알림 표시 & reload
    handelSuccess(event){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '계정이 성공적으로 저장되었습니다!',
                variant: 'success'
            }) 
        );

        this.closeModalBox(event);
        this.handleClose(event);
    }

    //Delete에 대한 작동?
    handleRowAction(event) {
        let actionName = event.target.action.name;
        let row = event.detail.row;

        switch (actionName) {
            case 'edit':
                
                break ;
            case 'delete':
                    
                break;
        }
    }

    deleteCon(event){
        let conRecord = [];
        conRecord.push(event.Id);
        deleteContacts
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '계정이 삭제되었습니다',
                variant: 'success'
            }) 
        );

        
    }

    // 한줄씩 삭제
    deleteSelectedContacts(){
        const idList = this.selectedContacts.map( row => { return row.Id })
        deleteContacts({contactIds : idList}).then( () => {
            // import refreshApex
            refreshApex(this.wiredContacts);
        })
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedContacts = undefined;
    }
}