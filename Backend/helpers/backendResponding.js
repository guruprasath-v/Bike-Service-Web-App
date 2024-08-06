const respondingUtility = (responseCode, responseSuccess, responseMessage, responseDescription, responseBody, responseSuggestedAction) => {
    return {
        code:responseCode,
        success:responseSuccess,
        message:responseMessage,
        description:responseDescription,
        body:responseBody,
        suggestedAction:responseSuggestedAction
    }
}


export default respondingUtility;