trigger CustomAccountTrigger on Custom_Account__c(before insert,before delete,before update) {

    // Custom Account에서 입력하면 Standard Account 에도 입력이 되게한다.
    if (Trigger.isinsert){
        List<Account> accounts = new List<Account>();

        for (Custom_Account__c a : Trigger.new) {

            accounts.add(new Account
                            ( Name          = a.Name,
                             AccountNumber  = a.AccountNumber__c,
                             OwnerId        = a.OwnerId,       
                             Phone          = a.Phone__c
                             )
                        );
        }
        insert accounts;

    } 
    // Custom Account에서 삭제하면 Standard Account  delete
    else if(Trigger.isdelete){

        for(Custom_Account__c a : Trigger.old){
             
             List<Account> deleteAccount =  [SELECT Id FROM ACCOUNT WHERE AccountNumber = :a.AccountNumber__c LIMIT 1]; 
            delete deleteAccount;
        }
   
    }

    // Custom Account에서 업데이트 하면 Standard Account  update
    else if(Trigger.isbefore && Trigger.isUpdate){

        //List<Account> updateAccount = new List<Account>();

        for(Custom_Account__c a :Trigger.old){
            
            // standard account와 Custom Account에있는거를 대조한다.
            Account updateAccount = [SELECT Id FROM ACCOUNT WHERE AccountNumber = :a.AccountNumber__c LIMIT 1];

            // 사용자가 입력하면 standard Account 에 있는 필드와 Custom Account에 있는 필드를 업데이트한다
            updateAccount.Name            = Trigger.new[0].Name;
            updateAccount.AccountNumber   = Trigger.new[0].AccountNumber__c;
            updateAccount.OwnerId         = Trigger.new[0].OwnerId;
            updateAccount.Phone           = Trigger.new[0].Phone__c;
                              
            update updateAccount;
        }
    }
    

        
    
}