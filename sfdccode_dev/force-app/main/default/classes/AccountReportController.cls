public with sharing class AccountReportController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountReportData() {
        return [SELECT OwnerId, Name  FROM Account LIMIT 10]; // Modify query as needed
    }
}
