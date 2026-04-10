import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: "https://ece3fd4cbcb1d13abb156f99e289f6f7@o4511196874866688.ingest.us.sentry.io/4511196877357056",
    sendDefaultPii: true,
});
