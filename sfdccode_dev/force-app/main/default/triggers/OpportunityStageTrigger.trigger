trigger OpportunityStageTrigger on Opportunity (after update,before update,before insert) {

    try{

            for(Opportunity newTriggerObj : Trigger.new){

                Opportunity oldTriggerObj = Trigger.oldMap.get(newTriggerObj.id);

               

                if(newTriggerObj.StageName != oldTriggerObj.StageName){

                    List<String> stageOrder = new List<String>{'Qualification','Needs Analysis','Value Proposition','Id. Decision Makers'

                                        ,'Perception Analysis','Proposal/Price Quote','Negotiation/Review','Closed Won','Closed Lost'};

                    Integer oldStageIndex = stageOrder.indexOf(newTriggerObj.StageName);

                    Integer newStageIndex = stageOrder.indexOf(oldTriggerObj.StageName);

                    if (oldStageIndex < newStageIndex) {

                            newTriggerObj.adderror('전단계 이동불가');

                    }

                }  

                if(newTriggerObj.StageName != null){

                    if(newTriggerObj.StageName == 'Proposal/Price Quote' && newTriggerObj.Amount == null){

                        newTriggerObj.addError('금액을 입력해주세요');

                    }

                }    

            }

    }catch(Exception e){

       System.debug(e.getMessage());

    }

   

}