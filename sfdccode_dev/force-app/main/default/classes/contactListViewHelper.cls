public with sharing class contactListViewHelper {
    
    //contact 가져오기
    @AuraEnabled
    public static List<Contact> getContacts(){
        return [SELECT Id, firstName, lastName, accountId, 
                account.name, mailingStreet, mailingCity, mailingState, mailingPostalCode, mailingCountry, email 
                FROM Contact
                LIMIT 1000];
    }

    // 최근 목록 필터
    @AuraEnabled
    public static List<Contact> recentView(){
        List<Contact> recentlyView = [SELECT Id, firstName, lastName, accountId, 
        account.name, mailingStreet, mailingCity, mailingState, mailingPostalCode, mailingCountry, email 
        FROM Contact ORDER BY LastViewedDate ASC
        LIMIT 1000];
        return recentlyView;
    }

    // 검색에서 contact List 가져오기
    @AuraEnabled
    public static List<Contact> searchContact(String searchString){
        String searchKeyword = '%'+searchString+'%';
        List<Contact> searchResult = [SELECT Id, firstName, lastName, accountId, 
        account.name, mailingStreet, mailingCity, mailingState, mailingPostalCode, mailingCountry, email 
        FROM Contact WHERE Name LIKE :searchKeyword LIMIT 100 ];
        return searchResult;
    }

    // 목록에서 contact 삭제하기
    @AuraEnabled
    public static void deleteContacts(List<Id> contactIds){
        if(contactIds.size() > 0 ){
            delete [SELECT Id FROM Contact WHERE Id in: contactIds];
        }
    }

    
}