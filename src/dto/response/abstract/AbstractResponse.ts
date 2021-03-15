export class AbstractResponse {
    message: string;

    data?: any;

    code: number;

    constructor(message: string, data?: any, code: number = 200) {
        this.message = message;
        this.data = data;
        this.code = code;
    }
}
