trigger PreventStageBackward on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);
        
        if (oldOpp.StageName != opp.StageName) {
            // Check if the new stage comes after the old stage in the stage order
            List<Schema.PicklistEntry> stageValues = Opportunity.StageName.getDescribe().getPicklistValues();
            Boolean validTransition = false;
            Integer oldStageIndex = -1;
            Integer newStageIndex = -1;
            
            for (Integer i = 0; i < stageValues.size(); i++) {
                if (stageValues[i].getValue() == oldOpp.StageName) {
                    oldStageIndex = i;
                }
                if (stageValues[i].getValue() == opp.StageName) {
                    newStageIndex = i;
                }
            }
            
            if (oldStageIndex >= 0 && newStageIndex >= 0 && newStageIndex >= oldStageIndex) {
                validTransition = true;
            }
            
            if (!validTransition) {
                opp.StageName = oldOpp.StageName; // Revert the stage back to the old value
                opp.addError('이전 단계로 돌아갈 수 없습니다.');
            }
        }

        try {
            if(opp.StageName != null){

                if(opp.StageName == 'Proposal/Price Quote' && opp.Amount == null){

                    opp.addError('금액을 입력해주세요');

                }

            }  
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        
       

    }
}