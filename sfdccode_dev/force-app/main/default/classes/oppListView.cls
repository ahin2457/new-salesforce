public with sharing class oppListView {
  
  // Select List
  @AuraEnabled
  public static List<Opportunity> getOpportunity(){
    return [SELECT Id, Name, AccountId, Amount ,CloseDate,StageName, type
    FROM Opportunity
              LIMIT 1000];
  }

  // Search
  @AuraEnabled
  public static List<Opportunity> searchOpp(String searchString){
      String searchKeyword ='%'+ searchString +'%';
      List<Opportunity> searchResult = [SELECT Id, Name, AccountId, Amount ,CloseDate,StageName
      FROM Opportunity WHERE Name LIKE : searchKeyword LIMIT 100];
      return searchResult; 
  
  }

  // All, recently 필터
  @AuraEnabled
  public static List<Opportunity> recentView(){
    List<Opportunity> recentOppView = [SELECT Id, Name, AccountId, Amount ,CloseDate,StageName, type
    FROM Opportunity ORDER BY LastViewedDate DESC
    LIMIT 1000];
    return recentOppView;
  }

}