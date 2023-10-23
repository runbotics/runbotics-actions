import { beforeAll, describe, it } from 'vitest';
import SapActionHandler from '../src/automation/sap/sap.action-handler';

describe('SAP Action Handler', () => {
    let sapActionHandler: SapActionHandler;

    beforeAll(() => {
        sapActionHandler = new SapActionHandler();
    });

    it('should connect', async () => {
        await sapActionHandler.connect({
            client: '<SAP client>',
            connectionName: '<SAP connection name>',
            password: '<SAP password>',
            user: '<SAP user>',
        });
    });
});
