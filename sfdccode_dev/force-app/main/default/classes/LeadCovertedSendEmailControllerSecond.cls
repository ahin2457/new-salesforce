public class LeadCovertedSendEmailControllerSecond {

    public static List<Lead> sendEmail(List<Lead> leads){

        emailTemplate et = [SELECT Id FROM EmailTemplate WHERE developername = 'emp_convert_lead' LIMIT 1];

        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

 

        for(Lead le : leads){

            if(le.Email != null){

                Messaging.SingleEmailMessage singleMail = new Messaging.SingleEmailMessage();

                singleMail.setTargetObjectId(le.OwnerId);

                singleMail.setTemplateId(et.Id);

                singleMail.setSaveAsActivity(false);

                emails.add(singleMail);

            }

        }

        Messaging.sendEmail(emails);

 

        return leads;

    }

}