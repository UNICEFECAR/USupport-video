import twilio from "twilio";
const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

export const generateToken = (config) => {
  return new AccessToken(
    config.twilio.accountSid,
    config.twilio.apiSid,
    config.twilio.apiSecret
  );
};

export const videoToken = (identity, room, config) => {
  let videoGrant;
  if (typeof room !== "undefined") {
    videoGrant = new VideoGrant({ room });
  } else {
    videoGrant = new VideoGrant();
  }
  const token = generateToken(config);
  token.addGrant(videoGrant);
  token.identity = identity;
  return token;
};
