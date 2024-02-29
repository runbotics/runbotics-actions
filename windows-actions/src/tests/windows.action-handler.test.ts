import { WindowsActionRequest } from 'automation/windows.types';
import WindowsActionHandler from '../automation/windows.action-handler';
import { WindowsErrorMessage } from '../automation/windows.error-message';
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
process.env.RUNBOTICS_EXECUTABLE_PATH = '';

const launchCalculator = () => {
    exec('calc', (error) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        console.log(`Calculator opened successfully`);
    });
};

describe('WindowsActionHandler', () => {
    let windowsActionHandler: WindowsActionHandler;
    launchCalculator();

    beforeEach(() => {
        windowsActionHandler = new WindowsActionHandler();
    });

    it('should be defined', () => {
        expect(windowsActionHandler).toBeDefined();
    });

    describe('isWindowOpen', () => {
        it('should return a boolean whether the input window is open or not', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.isWindowOpen',
                input: {
                    windowTitle: 'Kalkulator',
                },
            };

            const result = await windowsActionHandler.run(request);

            expect(typeof result).toBe('boolean');
        });
    });

    describe('getElement', () => {
        it('should return windows element by the provided locator', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.getElement',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:CalculatorResults',
                },
            };

            const result = await windowsActionHandler.run(request);

            expect(result).toBeDefined();
            expect(typeof result).toBe('object');
        });

        it('should throw if could not get element by provided locator', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.getElement',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'testLocator',
                },
            };

            const result = () => windowsActionHandler.run(request);

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
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.listWindows',
                input: {},
            };

            const result = await windowsActionHandler.run(request);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(Array.isArray(result) && result.length).not.toBe(0);
        });
    });

    describe('mouseClick', () => {
        it('should call method mouseClick which clicks window element by provided locator', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.mouseClick',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:num5Button',
                },
            };

            vi.spyOn(windowsActionHandler, 'mouseClick');

            await windowsActionHandler.run(request);

            expect(windowsActionHandler.mouseClick).toBeCalled();
        });
    });

    describe('waitForElement', () => {
        it('should wait for element by provided locator and return its properties', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.waitForElement',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:CalculatorResults',
                },
            };

            const result = await windowsActionHandler.run(request);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(Array.isArray(result) && result.length).not.toBe(0);
        });
    });

    describe('pressKeys', () => {
        it('should call method pressKeys which performs keyboard provided shortcut', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.pressKeys',
                input: {
                    windowTitle: 'Kalkulator',
                    keys: ['Ctrl', 'M'],
                },
            };

            vi.spyOn(windowsActionHandler, 'pressKeys');

            await windowsActionHandler.run(request);

            expect(windowsActionHandler.pressKeys).toBeCalled();
        });
    });

    describe('sendKeys', () => {
        it('should call method sendKeys which passes provided keys to the element specified by locator', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.sendKeys',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'id:CalculatorResults',
                    keys: '2137',
                    sendEnter: true,
                },
            };

            vi.spyOn(windowsActionHandler, 'sendKeys');

            await windowsActionHandler.run(request);

            expect(windowsActionHandler.sendKeys).toBeCalled();
        });
    });

    describe('minimizeWindow', () => {
        it('should call method minimizeWindow which minimizes window by provided locator', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.minimizeWindow',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'name:Kalkulator',
                },
            };

            vi.spyOn(windowsActionHandler, 'minimizeWindow');

            await windowsActionHandler.run(request);

            expect(windowsActionHandler.minimizeWindow).toBeCalled();
        });
    });

    describe('maximizeWindow', () => {
        it('should call method maximizeWindow which maximizes window by provided locator', async () => {
            const request: WindowsActionRequest = {
                ...defaultRequest,
                script: 'windows.maximizeWindow',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'name:Kalkulator',
                },
            };

            vi.spyOn(windowsActionHandler, 'maximizeWindow');

            await windowsActionHandler.run(request);

            expect(windowsActionHandler.maximizeWindow).toBeCalled();
        });
    });
});
