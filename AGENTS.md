# Architecture

- Keep AI prompts and model calls in authenticated Cloud Edge Functions, with the browser limited to invoking those functions; this protects credentials and shared AI usage.
