import * as express from 'express';
import SystemStatusController from './components/system-status/system-status.controller';
import ThenticIntegrationController from './components/thentic-integration/thentic-integration.controller';

export default function registerRoutes(app: express.Application): void {
    new SystemStatusController(app);
    new ThenticIntegrationController(app);
}
