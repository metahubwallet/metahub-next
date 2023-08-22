export const ErrorCodes = {
    MISSING_PARAMETER: 400,
    NO_SIGNATURE: 402,
    FORBIDDEN: 403,
    TIMED_OUT: 408,
    LOCKED: 423,
    UPGRADE_REQUIRED: 426,
    TOO_MANY_REQUESTS: 429,

};

export const ErrorTypes = {
    MALICIOUS: 'malicious',
    LOCKED: 'locked',
    PROMPT_CLOSED: 'prompt_closed',
    UPGRADE_REQUIRED: 'upgrade_required',
    MISSING_PARAMETER: 'missing_parameter',
};

export default class SdkError {
    type: string;
    message: string;
    code: number;
    isError: boolean;

    constructor(type: string, message: string, code = ErrorCodes.LOCKED) {
        this.type = type;
        this.message = message;
        this.code = code;
        this.isError = true;
    }

    static locked() {
        return new SdkError(
            ErrorTypes.LOCKED,
            "The user's Scatter is locked. They have been notified and should unlock before continuing."
        );
    }

    static maliciousEvent() {
        return new SdkError(
            ErrorTypes.MALICIOUS,
            'Malicious event discarded.',
            ErrorCodes.FORBIDDEN
        );
    }

    static signatureError(type: string, message: string) {
        return new SdkError(type, message, ErrorCodes.NO_SIGNATURE);
    }

    static requiresUpgrade() {
        return new SdkError(
            ErrorTypes.UPGRADE_REQUIRED,
            "The required version is newer than the User's Scatter",
            ErrorCodes.UPGRADE_REQUIRED
        );
    }

    static missingParameter(msg: string) {
        return new SdkError(
            ErrorTypes.MISSING_PARAMETER,
            msg,
            ErrorCodes.MISSING_PARAMETER
        );
    }

    static noNetwork() {
        return this.signatureError('no_network', 'You must bind a network first');
    }

    static usedKeyProvider() {
        return new SdkError(
            ErrorTypes.MALICIOUS,
            'Do not use a `keyProvider` with a Scatter. Use a `signProvider` and return only signatures to this object. A malicious person could retrieve your keys otherwise.',
            ErrorCodes.NO_SIGNATURE
        );
    }
}
