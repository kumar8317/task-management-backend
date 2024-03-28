import { PoolClient } from "../databaseService"
import databaseService from "../utils/database";
import { UserDetails } from "./declaration";


/**
 * 
 * User Insert Query
 */
export const storeUserDetails = async(userDetails:UserDetails, pgClient: PoolClient):Promise<void> => {
    const query = `INSERT INTO users(email,password,id)
        VALUES ($1,$2,$3);
    `;
    const parameters = [userDetails.email, userDetails.password, userDetails.id];
    await databaseService.queryByClient(pgClient,query,parameters);
}
export const insertUsersTx = async (
    userDetails: UserDetails
): Promise<void> => {
    const trx = async (client: PoolClient) => {
        await storeUserDetails(userDetails,client);
    };
    await databaseService.transaction(trx);
}

/**
 * Retreives user queries
 */
export const getUserById = async(userID:string): Promise<UserDetails | undefined> => {
    const query = `SELECT * from users where id = $1`;
    const result = await databaseService.query(query,[userID]);
    return result.rows[0];
}

export const getUserByEmail = async(email:string): Promise<UserDetails | undefined> => {
    const query = `SELECT * from users where email = $1`;
    const result = await databaseService.query(query,[email]);
    return result.rows[0];
}

export const getAllUsers = async(email:string): Promise<UserDetails[]> => {
    const query = `SELECT * from users`;
    const result = await databaseService.query(query,[email]);
    return result.rows;
}