public class LeadConversionValidator {
    public static Boolean isLeadConversionAllowed(Id leadId) {
        Lead lead = [SELECT Id, Rating FROM Lead WHERE Id = :leadId];
        return lead.Rating == 'Hot';
    }
}
