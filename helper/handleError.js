class HandleError extends Error {
    constructor(message,statusCode){
        super(message);
        this.message = message;
        this.statusCode = statusCode || 500;
        this.name = "HandleError";
        Error.captureStackTrace(this, HandleError);


    }
}
export default HandleError;