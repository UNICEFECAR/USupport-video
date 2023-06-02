import express from "express";

const router = express.Router();

import { getTwilioToken, leaveConsultation } from "#controllers/video";

import {
  getTwilioTokenSchema,
  leaveConsultationSchema,
} from "#schemas/videoSchemas";

router.get("/twilio-token", async (req, res, next) => {
  /**
   * #route   GET /video/v1/twilio-token
   * #desc
   */
  const country = req.header("x-country-alpha-2");
  const language = req.header("x-language-alpha-2");
  const userId = req.header("x-user-id");

  const consultationId = req.query.consultationId;

  return await getTwilioTokenSchema
    .noUnknown(true)
    .strict(true)
    .validate({ country, language, userId, consultationId })
    .then(getTwilioToken)
    .then((result) => res.status(200).send(result))
    .catch(next);
});

router.put("/leave-consultation", async (req, res, next) => {
  /**
   * #route   PUT /provider/v1/consultation/finished
   * #desc    Client/Provider leave a consultation
   */
  const country = req.header("x-country-alpha-2");
  const language = req.header("x-language-alpha-2");
  const userId = req.header("x-user-id");

  const payload = req.body;

  return await leaveConsultationSchema
    .noUnknown(true)
    .strict()
    .validate({ country, language, userId, ...payload })
    .then(leaveConsultation)
    .then((result) => res.status(200).send(result))
    .catch(next);
});

export { router };
