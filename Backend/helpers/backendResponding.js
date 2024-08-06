const respondingUtility = (responseCode, responseSuccess, responseMessage, responseDescription, responseBody, responseSuggestedAction, reponseRole) => {
    return {
        code:responseCode,
        success:responseSuccess,
        message:responseMessage,
        description:responseDescription,
        body:responseBody,
        suggestedAction:responseSuggestedAction,
        role:reponseRole || "Customer"
    }
}


export default respondingUtility;