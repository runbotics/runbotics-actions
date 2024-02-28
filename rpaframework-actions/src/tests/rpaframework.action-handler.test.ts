import { RpaFrameworkActionRequest } from 'automation/rpaframework.types';
import RpaFrameworkActionHandler from '../automation/rpaframework.action-handler';
import { RpaFrameworkErrorMessage } from '../automation/rpaframework.error-message';
import { exec } from 'child_process';

const defaultRequest = {
    processInstanceId: 'mock processInstanceId',
    rootProcessInstanceId: 'mock rootProcessInstanceId',
    userId: 2137,
    executionContext: undefined,
    trigger: {
        name: 'mock trigger name',
    },
};

// must be absolute path to the .exe file
process.env.RUNBOTICS_RPAFRAMEWORK_EXE_DIR = '';

const launchCalculator = () => {
    exec('calc', (error) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        console.log(`Calculator opened successfully`);
    });
};

describe('RpaFrameworkActionHandler', () => {
    let rpaFrameworkActionHandler: RpaFrameworkActionHandler;
    launchCalculator();

    beforeEach(() => {
        rpaFrameworkActionHandler = new RpaFrameworkActionHandler();
    });

    it('should be defined', () => {
        expect(rpaFrameworkActionHandler).toBeDefined();
    });

    describe('isWindowOpen', () => {
        it('should return a boolean whether the input window is open or not', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.isWindowOpen',
                input: {
                    windowTitle: 'Kalkulator',
                },
            };

            const result = await rpaFrameworkActionHandler.run(request);

            expect(typeof result).toBe('boolean');
        });
    });

    describe('getElement', () => {
        it('should return windows element by the provided locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.getElement',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:CalculatorResults',
                },
            };

            const result = await rpaFrameworkActionHandler.run(request);

            expect(result).toBeDefined();
            expect(typeof result).toBe('object');
        });

        it('should throw if could not get element by provided locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.getElement',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'testLocator',
                },
            };

            const result = () => rpaFrameworkActionHandler.run(request);

            try {
                await result();
                expect(result).toThrow();
            } catch (error) {
                console.log('Successfully got error:', error);
            }
        });
    });

    describe('listWindows', () => {
        it('should return list of currently running windows', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.listWindows',
                input: {},
            };

            const result = await rpaFrameworkActionHandler.run(request);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(Array.isArray(result) && result.length).not.toBe(0);
        });
    });

    describe('mouseClick', () => {
        it('should call method mouseClick which clicks window element by provided locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.mouseClick',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:num5Button',
                },
            };

            vi.spyOn(rpaFrameworkActionHandler, 'mouseClick');

            await rpaFrameworkActionHandler.run(request);

            expect(rpaFrameworkActionHandler.mouseClick).toBeCalled();
        });
    });

    describe('waitForElement', () => {
        it('should wait for element by provided locator and return its properties', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.waitForElement',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:CalculatorResults',
                },
            };

            const result = await rpaFrameworkActionHandler.run(request);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(Array.isArray(result) && result.length).not.toBe(0);
        });
    });

    describe('pressKeys', () => {
        it('should call method pressKeys which performs keyboard provided shortcut', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.pressKeys',
                input: {
                    windowTitle: 'Kalkulator',
                    keys: ['Ctrl', 'M'],
                },
            };

            vi.spyOn(rpaFrameworkActionHandler, 'pressKeys');

            await rpaFrameworkActionHandler.run(request);

            expect(rpaFrameworkActionHandler.pressKeys).toBeCalled();
        });
    });

    describe('sendKeys', () => {
        it('should call method sendKeys which passes provided keys to the element specified by locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.sendKeys',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:CalculatorResults',
                    keys: '2137',
                    sendEnter: true,
                },
            };

            vi.spyOn(rpaFrameworkActionHandler, 'sendKeys');

            await rpaFrameworkActionHandler.run(request);

            expect(rpaFrameworkActionHandler.sendKeys).toBeCalled();
        });
    });

    describe('minimizeWindow', () => {
        it('should call method minimizeWindow which minimizes window by provided locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.minimizeWindow',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'name:Kalkulator',
                },
            };

            vi.spyOn(rpaFrameworkActionHandler, 'minimizeWindow');

            await rpaFrameworkActionHandler.run(request);

            expect(rpaFrameworkActionHandler.minimizeWindow).toBeCalled();
        });
    });

    describe('maximizeWindow', () => {
        it('should call method maximizeWindow which maximizes window by provided locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaFramework.maximizeWindow',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'name:Kalkulator',
                },
            };

            vi.spyOn(rpaFrameworkActionHandler, 'maximizeWindow');

            await rpaFrameworkActionHandler.run(request);

            expect(rpaFrameworkActionHandler.maximizeWindow).toBeCalled();
        });
    });
});
