export { Toni } from './client.js';
export { Agent } from './agent.js';
export type { AgentOptions, AgentResult, AgentStep, CustomTool, PendingCall, RunOptions } from './agent.js';
export {
  ToniError, ToniApiError, ToniConnectionError, AuthenticationError, InsufficientCreditError,
  PermissionError, ConfirmationRequiredError, RateLimitError,
} from './errors.js';
export { CATALOG, API_VERSION } from './generated/catalog.js';
export { VERSION } from './http.js';
export type * from './types.js';
export type * from './generated/areas.js';

import { Toni } from './client.js';
export default Toni;
