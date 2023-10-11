public with sharing class contactListViewHelper {
    
    //contact 가져오기
    @AuraEnabled(cacheable=True)
    public static List<Contact> getContacts(){
        return [SELECT Id, firstName, lastName, accountId, 
                account.name, mailingStreet, mailingCity, mailingState, mailingPostalCode, mailingCountry, email 
                FROM Contact
                LIMIT 1000];
    }

    // 검색에서 contact List 가져오기
    @AuraEnabled(cacheable=True)
    public static List<Contact> searchContact(String searchString){
        List<List<SObject>> contacts = [FIND :searchString IN ALL FIELDS RETURNING Contact(FirstName, LastName, Email, mailingStreet,
        mailingCity, mailingCountry, mailingPostalCode, account.Name)];

        return (List<Contact>) contacts[0];
    }

    // 목록에서 contact 삭제하기
    @AuraEnabled
    public static void deleteContacts(List<Id> contactIds){
        if(contactIds.size() > 0 ){
            delete [SELECT Id FROM Contact WHERE Id in: contactIds];
        }
    }
}