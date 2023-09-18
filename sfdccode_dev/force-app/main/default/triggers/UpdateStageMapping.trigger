trigger UpdateStageMapping on Opportunity (before insert, before update) {
   if(Trigger.isinsert){
        List<Opportunity> opportunities = new List<Opportunity>();

        for (Opportunity opp : Trigger.new){

           if(opp.StageName == null){
                opp.StageName = opp.stage2__c;
           }
            
        }


   }
   
    if(Trigger.isUpdate){
    for (Opportunity opp : Trigger.new) {
        
        // 이전의 값을 가져온다 
        Opportunity oldOpp = Trigger.oldMap.get(opp.id);
        
        // stage2의 값과 이전의 stage 값이 같지 않으면
        if (opp.stage2__c != oldOpp.StageName) {
            
            // 기회 단계가 변경될 때만 실행
            opp.StageName = opp.stage2__c; 
        }
        else if(opp.StageName != oldOpp.stage2__c && (opp.StageName != 'Closed Won' && opp.StageName != 'Closed Lost')){

            opp.stage2__c = opp.StageName;
        }
        else if(opp.StageName == 'Closed Won' || opp.StageName == 'Close Lost'){

            opp.stage2__c = null;
        }
        
      }
     
    }
}