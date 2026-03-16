import NewsletterSubscriber from "../models/NewsletterSubscriber";

export const subscribeEmail = async (email: string) => {
  const existing = await NewsletterSubscriber.findOne({ email }).lean();
  if (existing) return { subscribed: false, subscriber: existing };

  const subscriber = await NewsletterSubscriber.create({ email });
  return { subscribed: true, subscriber };
};
