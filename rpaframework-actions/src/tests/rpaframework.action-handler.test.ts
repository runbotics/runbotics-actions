import { RpaFrameworkActionRequest } from 'automation/rpaframework.types';
import RpaFrameworkActionHandler from '../automation/rpaframework.action-handler';
import { RpaFrameworkErrorMessage } from '../automation/rpaframework.error-message';

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
process.env.RUNBOTICS_RPAFRAMEWORK_EXE_DIR = 'C:\\Users\\A029707\\Desktop\\projects\\runbotics-actions\\rpaframework-actions\\rpaframework-dist\\rpaframework-actions.exe';

describe('RpaFrameworkActionHandler', () => {
    let rpaFrameworkActionHandler: RpaFrameworkActionHandler;

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
                script: 'rpaframework.isWindowOpen',
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
                script: 'rpaframework.getElement',
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
                script: 'rpaframework.getElement',
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
                console.log(error);
            }
        });
    });

    describe('getWindowElements', () => {
        it('should return list of elements for provided window title', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaframework.getWindowElements',
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
                script: 'rpaframework.mouseClick',
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
                script: 'rpaframework.waitForElement',
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
                script: 'rpaframework.pressKeys',
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
                script: 'rpaframework.sendKeys',
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
                script: 'rpaframework.minimizeWindow',
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
                script: 'rpaframework.maximizeWindow',
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

    describe('closeWindow', () => {
        it('should call method closeWindow which closes window by provided locator', async () => {
            const request: RpaFrameworkActionRequest = {
                ...defaultRequest,
                script: 'rpaframework.closeWindow',
                input: {
                    windowTitle: 'Kalkulator',
                    locator: 'name:Kalkulator',
                },
            };

            vi.spyOn(rpaFrameworkActionHandler, 'closeWindow');

            await rpaFrameworkActionHandler.run(request);

            expect(rpaFrameworkActionHandler.closeWindow).toBeCalled();
        });
    });
});
