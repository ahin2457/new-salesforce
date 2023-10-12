public with sharing class LeadController {
 
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadData() {
        String keywordWithWildcard = '%' + searchKey + '%';
        return [
                SELECT Id, Name, Email, Company, Rating, Status , Title, MobilePhone
                FROM Lead WHERE Status != 'Closed - Converted' AND Name=:keywordWithWildcard ORDER BY CreatedDate DESC];
    }

}
