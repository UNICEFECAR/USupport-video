import * as yup from "yup";

export const getTwilioTokenSchema = yup.object().shape({
  country: yup.string().required(),
  language: yup.string().required(),
  consultationId: yup.string().uuid().required(),
  userId: yup.string().uuid().required(),
});

export const leaveConsultationSchema = yup.object().shape({
  country: yup.string().required(),
  language: yup.string().required(),
  userId: yup.string().uuid().required(),
  consultationId: yup.string().uuid().required(),
  userType: yup.string().oneOf(["client", "provider"]).required(),
});
