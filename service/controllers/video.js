import twilio from "twilio";
import { videoToken } from "#utils/helperFunctions";

const TWILIO_CONFIG = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    apiSid: process.env.TWILIO_API_SID,
    apiSecret: process.env.TWILIO_API_SECRET,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },
};

import {
  getConsultationByIdQuery,
  leaveConsultationClientQuery,
  leaveConsultationProviderQuery,
  updateConsultationStatusAsFinishedQuery,
} from "#queries/video";

import { consultationNotFound } from "#utils/errors";

export const getTwilioToken = async ({
  userId,
  country,
  language,
  consultationId,
}) => {
  // Check if the consultation is in the right status
  await getConsultationByIdQuery({
    poolCountry: country,
    consultationId,
  })
    .then(async (raw) => {
      if (raw.rowCount === 0) {
        throw consultationNotFound(language);
      }

      return raw.rows[0];
    })
    .catch((err) => {
      throw err;
    });

  const token = videoToken(userId, consultationId, TWILIO_CONFIG);

  return { token: token.toJwt() };
};

export const leaveConsultation = async ({
  country,
  language,
  userId,
  consultationId,
  userType,
}) => {
  // Store the leave time for the user type and update the status if both users have left
  let newConsultation;

  if (userType === "client") {
    newConsultation = await leaveConsultationClientQuery({
      poolCountry: country,
      consultationId,
    })
      .then(async (raw) => {
        if (raw.rowCount === 0) {
          throw consultationNotFound(language);
        }

        return raw.rows[0];
      })
      .catch((err) => {
        throw err;
      });
  } else if (userType === "provider") {
    newConsultation = await leaveConsultationProviderQuery({
      poolCountry: country,
      consultationId,
    })
      .then(async (raw) => {
        if (raw.rowCount === 0) {
          throw consultationNotFound(language);
        }

        return raw.rows[0];
      })
      .catch((err) => {
        throw err;
      });
  }

  // Update the status of the consultation if both users have left
  if (
    newConsultation.client_leave_time !== null &&
    newConsultation.provider_leave_time !== null
  ) {
    await updateConsultationStatusAsFinishedQuery({
      poolCountry: country,
      consultationId,
    }).catch((err) => {
      throw err;
    });
  }

  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  client.video
    .rooms(consultationId)
    .participants(userId)
    .update({
      status: "disconnected",
    })
    .catch((err) => {
      throw err;
    });

  return { success: true };
};
