import RpaFrameworkActionHandler from './automation/rpaframework.action-handler';

export default {
  'rpaframework': RpaFrameworkActionHandler
}

// const { spawn } = require('child_process');

// const windowTitleR2P = Buffer.from('R2płatnikPRO w.10.10 (76/1000) - BEZ MOŻLIWOŚCI DRUKOWANIA - R2P_platnik10 na localhost\\SQLEXPRESS', 'utf-8').toString();
// const windowTitleWorkers = Buffer.from('PRACOWNICY', 'utf-8').toString();
// const windowTitlePayrolls = Buffer.from('LISTY PŁAC', 'utf-8').toString();

// const action1 = ['-windowTitle', windowTitleR2P, '-isWindowOpen'];
// const action2 = ['-windowTitle', windowTitleR2P, '-maximizeWindow', windowTitleR2P];
// const action3 = ['-windowTitle', windowTitleR2P, '-pressKeys', '["Alt", "o"]'];
// const action4 = ['-windowTitle', windowTitleR2P, '-mouseClick', '{"locator": "228"}'];
// const action5 = ['-windowTitle', windowTitleWorkers, '-isWindowOpen'];
// const action6 = ['-windowTitle', windowTitleWorkers, '-maximizeWindow', windowTitleWorkers];
// const action8 = ['-windowTitle', windowTitleWorkers, '-pressKeys', '["Alt", "f4"]'];
// const action9 = ['-windowTitle', windowTitleWorkers, '-isWindowOpen'];
// const action10 = ['-windowTitle', windowTitleR2P, '-isWindowOpen'];
// const action11 = ['-windowTitle', windowTitleR2P, '-pressKeys', '["Alt", "o"]'];
// const action12 = ['-windowTitle', windowTitleR2P, '-mouseClick', '{"locator": "229"}'];
// const action13 = ['-windowTitle', windowTitlePayrolls, '-isWindowOpen'];
// const action14 = ['-windowTitle', windowTitlePayrolls, '-maximizeWindow', windowTitlePayrolls];
// const action16 = ['-windowTitle', windowTitlePayrolls, '-pressKeys', '["Alt", "f4"]'];
// const action17 = ['-windowTitle', windowTitlePayrolls, '-isWindowOpen'];
// const action19 = ['-windowTitle', windowTitleR2P, '-pressKeys', '["Alt", "f4"]'];
// const action20 = ['-windowTitle', windowTitleR2P, '-isWindowOpen'];

// const main = async (command, args, actionName) => {
//   console.log(`Starting action (${actionName})`);

//   const child = spawn(command, args);

//   const isValidJson = (value) => {
//     try {
//       JSON.parse(value);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   return new Promise((resolve, reject) => {
//     let errorMessage = Buffer.alloc(0);
//     let actionResult = null;

//     const onData = (data) => {
//       if (isValidJson(data)) {
//         actionResult = JSON.parse(data);
//         console.log(actionResult);
//       } else {
//         actionResult = data.toString();
//         console.log(actionResult);
//       }
//     };

//     const onError = (error) => {
//       errorMessage = Buffer.concat([errorMessage, error]);
//     };

//     const onClose = (code) => {
//       if (code) {
//         reject(errorMessage.toString().trim());
//       } else {
//         resolve(actionResult);
//       }

//       child.stdout.off('data', onData);
//       child.stderr.off('data', onError);
//       child.off('close', onClose);
//     };

//     child.stdout.on('data', onData);
//     child.stderr.on('data', onError);
//     child.on('close', onClose);
//   });
// };

// const processRunner = async () => {
//   try {
//     console.log('Running new process...');
//     await main('./runner.exe', action1, 'action1');
//     await main('./runner.exe', action2, 'action2');
//     await main('./runner.exe', action3, 'action3');
//     await main('./runner.exe', action4, 'action4');
//     await main('./runner.exe', action5, 'action5');
//     await main('./runner.exe', action6, 'action6');
//     await main('./runner.exe', action8, 'action8');
//     await main('./runner.exe', action9, 'action9');
//     await main('./runner.exe', action10, 'action10');
//     await main('./runner.exe', action11, 'action11');
//     await main('./runner.exe', action12, 'action12');
//     await main('./runner.exe', action13, 'action13');
//     await main('./runner.exe', action14, 'action14');
//     await main('./runner.exe', action16, 'action16');
//     await main('./runner.exe', action17, 'action17');
//     await main('./runner.exe', action19, 'action19');
//     await main('./runner.exe', action20, 'action20');
//     console.log('Successfully completed process.');
//   } catch (error) {
//     console.error(error);
//   }
// };

// processRunner();
