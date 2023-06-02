import { getDBPool } from "#utils/dbConfig";

export const getConsultationByIdQuery = async ({
  poolCountry,
  consultationId,
}) =>
  await getDBPool("clinicalDb", poolCountry).query(
    `
  
        SELECT * 
        FROM consultation
        WHERE consultation_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
  
      `,
    [consultationId]
  );

export const leaveConsultationClientQuery = async ({
  poolCountry,
  consultationId,
}) =>
  await getDBPool("clinicalDb", poolCountry).query(
    `
      
          UPDATE consultation
          SET client_leave_time = now()
          WHERE consultation_id = $1
          RETURNING *;
    
        `,
    [consultationId]
  );

export const leaveConsultationProviderQuery = async ({
  poolCountry,
  consultationId,
}) =>
  await getDBPool("clinicalDb", poolCountry).query(
    `
        
          UPDATE consultation
          SET provider_leave_time = now()
          WHERE consultation_id = $1
          RETURNING *;
    
        `,
    [consultationId]
  );

export const updateConsultationStatusAsFinishedQuery = async ({
  poolCountry,
  consultationId,
}) =>
  await getDBPool("clinicalDb", poolCountry).query(
    `

      UPDATE consultation
      SET status = 'finished'
      WHERE consultation_id = $1

    `,
    [consultationId]
  );
