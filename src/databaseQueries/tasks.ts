import { PoolClient } from "../databaseService";
import databaseService from "../utils/database";
import { TaskDetails } from "./declaration";

/**
 * Store Task Details
 */
export const storeTaskDetails = async (
  taskDetails: TaskDetails,
  pgClient: PoolClient
): Promise<void> => {
  const query = `INSERT INTO tasks(title,description,status,user_id,id)
        VALUES ($1,$2,$3,$4,$5);
    `;
  const parameters = [
    taskDetails.title,
    taskDetails.description,
    taskDetails.status,
    taskDetails.user_id,
    taskDetails.id
  ];
  await databaseService.queryByClient(pgClient, query, parameters);
};

export const insertTasksTx = async (
  taskDetails: TaskDetails
): Promise<void> => {
  const trx = async (client: PoolClient) => {
    await storeTaskDetails(taskDetails, client);
  };
  await databaseService.transaction(trx);
};

/**
 * Updates Task Details
 */
export const updateTaskQuery = async (taskDetails: {
  updateBy: {
    id: string;
  };
  updateFields: {
    title?: string;
    description?: string;
    status?: string;
  };
}): Promise<void> => {
  const fields: string[] = [];
  const { updateBy, updateFields } = taskDetails;

  if (updateFields.title) fields.push(`title='${updateFields.title}'`);
  if (updateFields.description)
    fields.push(`description='${updateFields.description}'`);
  if (updateFields.status) fields.push(`status='${updateFields.status}'`);

  const query = `UPDATE tasks SET ${fields.join(",")} WHERE id=$1`;

  await databaseService.transaction(async (client: PoolClient) => {
    await databaseService.queryByClient(client, query, [updateBy.id]);
  });
};

/**
 * Retreives task queries
 */
export const getTaskByIdQuery = async (
  taskID: string
): Promise<TaskDetails | undefined> => {
  const query = `SELECT * from tasks where id = $1`;
  const result = await databaseService.query(query, [taskID]);
  return result.rows[0];
};

export const getTasksByUserQuery = async (
  user_id: string,
  page: number = 1,
  pageSize: number = 10,
  filters?: Partial<TaskDetails>
): Promise<TaskDetails[]> => {
  let filterQuery = "";
  let filterParams: any[] = [user_id];
  if (filters) {
    const filterConditions = Object.keys(filters)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(" AND ");
    filterQuery = ` AND ${filterConditions}`;
    filterParams = [...filterParams, ...Object.values(filters)];
  }
  const offset = (page - 1) * pageSize;
  const query = `
        SELECT * FROM tasks 
        WHERE user_id = $1 ${filterQuery}
        LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`;
  const result = await databaseService.query(query, [
    ...filterParams,
    pageSize,
    offset,
  ]);
  return result.rows;
};

export const getAllTasksQuery = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: Partial<TaskDetails>
): Promise<TaskDetails[]> => {
  let filterQuery = "";
  let filterParams: any[] = [];
  if (filters) {
    const filterConditions = Object.keys(filters)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");
    filterQuery = ` WHERE ${filterConditions}`;
    filterParams = [...Object.values(filters)];
  }
  const offset = (page - 1) * pageSize;
  const query = `
        SELECT * FROM tasks ${filterQuery}
        LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`;
  const result = await databaseService.query(query, [
    ...filterParams,
    pageSize,
    offset,
  ]);
  return result.rows;
};


/**
 * Delete task
 */
export const deleteTaskQuery = async (
    taskId: string
  ): Promise<void> => {
    const query = `DELETE from tasks where id = $1`;
  
    await databaseService.transaction(async (client: PoolClient) => {
      await databaseService.queryByClient(client, query, [taskId]);
    });
  };