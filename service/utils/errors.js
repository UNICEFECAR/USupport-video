import { t } from "#translations/index";

export const consultationNotFound = (language) => {
  const error = new Error();
  error.message = t("consultation_not_found_error", language);
  error.name = "CONSULTATION NOT FOUND";
  error.status = 404;
  return error;
};
export const consultationNotScheduled = (language) => {
  const error = new Error();
  error.message = t("consultation_not_scheduled_error", language);
  error.name = "CONSULTATION NOT SCHEDULED";
  error.status = 400;
  return error;
};
