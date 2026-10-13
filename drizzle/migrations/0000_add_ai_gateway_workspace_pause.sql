CREATE TABLE public.ai_gateway_workspace_pause (
  scope TEXT PRIMARY KEY CHECK (scope = 'workspace'),
  status_code INTEGER NOT NULL CHECK (status_code IN (402, 403)),
  message TEXT NOT NULL CHECK (length(message) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.ai_gateway_workspace_pause TO service_role;
ALTER TABLE public.ai_gateway_workspace_pause ENABLE ROW LEVEL SECURITY;