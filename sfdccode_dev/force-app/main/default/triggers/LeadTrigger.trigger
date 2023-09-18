trigger LeadTrigger on Lead (before insert, before update, after update) {
   
    // before
    
    if(Trigger.isBefore){
            
            // 이메일 주소를 키로 사용하여 Lead 레코드를 저장하는 맵입니다. 중복 검사 및 오류 추가를 위해 사용됩니다.
            Map<String, Lead> leadMap = new Map<String, Lead>();
            
            // 'System.Trigger.new':  현재 트리거의 삽입 또는 업데이트되는 Lead 레코드 목록.
            // 루프는 각 Lead 레코드에 대해 실행되)며, 이메일 주소가 존재하고 삽입되거나 업데이트되는 경우에만 맵에 추가함.
            for (Lead Lead : System.Trigger.new) {
            
                
                if ((Lead.Email != null) && (System.Trigger.isInsert || (Lead.Email != System.Trigger.oldMap.get(Lead.Id).Email))) {
            
                    leadMap.put(Lead.Email, Lead);
                    
                }
            }
            
        
            // 'SELECT Email From Lead WHERE Email IN :leadMap.keySet()' : 이메일 주소가 leadMap의 키 (KeySet)에 있는 Lead 레코드를 데이터베이스에서 검색함.
            for (Lead lead : [SELECT Email 
                            FROM Lead
                            WHERE Email IN :leadMap.KeySet()]) {
                Lead newLead = leadMap.get(Lead.Email);
                newLead.Email.addError('이 전자 메일 주소를 가진 리드가 이미 있습니다.');
            }
        



        if(Trigger.isUpdate){
                // 단계 - 이전 단계로 돌아가지 못함(LeadStatus)
            // Map<Id, Lead> oldLeads = new Map<Id, Lead>([SELECT Id, Status FROM Lead WHERE Id IN :Trigger.oldMap.keySet()]);



            //리드 업데이트 시 sendEmail 이메일 전송, 리드 전환 시 sendEmailConvert 이메일 전송
    


        

            for (Lead lead : Trigger.new) {
                // Lead oldLead = oldLeads.get(lead.Id);
                Lead oldLead = Trigger.oldMap.get(lead.Id);
        
                // 이전 상태와 현재 상태가 다를 경우
                if (oldLead.Status != lead.Status) {
                    List<String> leadStatuses = new List<String>{'Open - Not Contacted', 'Working - Contacted', 'Closed - Not Converted', 'Closed - Converted'};
                    Integer oldIndex = leadStatuses.indexOf(oldLead.Status);
                    Integer newIndex = leadStatuses.indexOf(lead.Status);
        
                    // 현재 상태의 인덱스가 이전 상태의 인덱스보다 작을 경우 (단계로 넘어간 경우)
                    if (newIndex < oldIndex) {
                        lead.Status.addError('이전 단계로 돌아갈 수 없습니다.');
                    }
                }
                if (lead.IsConverted != oldLead.IsConverted && !LeadConversionValidator.isLeadConversionAllowed(lead.Id)) {
                    lead.addError('리드 변환이 HOT 인경우에만 허용됩니다.');
                }

                if(oldLead.Status != lead.Status && lead.Status != 'Closed - Converted'){
            
                    LeadConvertSendEmailController.sendEmail(Trigger.new);
                  }
              if(lead.Status == 'Closed - Converted'){
              
                LeadCovertedSendEmailControllerSecond.sendEmail(Trigger.new);
                  }
            }

        }

   
        
       
    }



    // after
   
    if(Trigger.isAfter){

        // working - contacted로 전환되면 task 표시
        List<Task> newTasks = new List<Task>();
        
    
        if(Trigger.isUpdate){
            for (Lead obj : Trigger.new) {
    
    
                // Lead의 Status가 "Working - Contacted"로 변경되었는지 확인
                if (obj.Status == 'Working - Contacted') {
                    Task newTask = new Task();
                    
                    newTask.Subject = '전화걸기'; // Task의 제목 설정
                    newTask.WhoId = obj.Id; // Task의 연결 대상을 Lead로 설정        
                    newTask.Status = 'Not Started'; // Task의 상태 설정
                    newTask.OwnerId = obj.OwnerId;
                    
                    newTasks.add(newTask);
                }
    
               
            }
            
            if (newTasks.size() > 0) {
                insert newTasks; // 새 Task 레코드를 Salesforce에 삽입
            }
    
           
        }

    }

  

}