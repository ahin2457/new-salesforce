public with sharing class LeadReportController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadReportData() {
        return [SELECT Lead_UserName__c, LastName, FirstName, Title, Company, LeadSource, Email, Rating  FROM Lead LIMIT 10]; // Modify query as needed
    }
}
