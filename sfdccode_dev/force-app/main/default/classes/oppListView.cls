public with sharing class oppListView {
  
// Select List
 @AuraEnabled
 public static List<Opportunity> getOpportunity(){
   return [SELECT Id, Name, AccountId, Amount ,CloseDate,StageName
   FROM Opportunity
            LIMIT 1000];
 }





}