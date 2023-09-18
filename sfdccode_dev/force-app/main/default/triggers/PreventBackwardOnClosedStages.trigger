trigger PreventBackwardOnClosedStages on Opportunity (before update) {
    // Map to store the allowed stages that can follow 'Closed Won' or 'Closed Lost'
    Map<String, Set<String>> allowedNextStages = new Map<String, Set<String>>{
        'Closed Won' => new Set<String>{},    // No stages can follow 'Closed Won'
        'Closed Lost' => new Set<String>{}    // No stages can follow 'Closed Lost'
    };

    // Populate the allowedNextStages map with the stages that can follow 'Closed Won' or 'Closed Lost'
    allowedNextStages.get('Closed Won').add('Closed Lost');
    allowedNextStages.get('Closed Lost').add('Closed Won');

    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);

        if (opp.StageName != oldOpp.StageName && (opp.IsClosed || oldOpp.IsClosed)) {
            Set<String> allowedNext = allowedNextStages.get(opp.StageName);
            if (allowedNext != null && allowedNext.contains(oldOpp.StageName)) {
                opp.addError('Closed 상태에서는 전 단계로 이동할 수 없습니다.');
            }
        }
    }
}