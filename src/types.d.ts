declare namespace Express {
    export interface Request {
        user: {
            id: string,
            email: string,
        };
    }
    export interface Response {
        user: any;
    }
}