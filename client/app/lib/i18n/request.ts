import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "fr";

  return {
    locale,
    timeZone: "Europe/Paris",
    messages: (await import(`../../../public/messages/${locale}.json`)).default, // .default to get the actual messages object
  };
});
