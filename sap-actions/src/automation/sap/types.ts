import { DesktopRunRequest } from '@runbotics/runbotics-sdk';

export type SAPActionRequest =
| DesktopRunRequest<'sap.connect', SAPConnectActionInput>
| DesktopRunRequest<'sap.startTransaction', SAPStartTransactionActionInput>
| DesktopRunRequest<'sap.endTransaction', never>
| DesktopRunRequest<'sap.type', SAPTypeActionInput>
| DesktopRunRequest<'sap.disconnect', never>
| DesktopRunRequest<'sap.sendVKey', SAPSendVKeyActionInput>
| DesktopRunRequest<'sap.readText', SAPReadTextActionInput>
| DesktopRunRequest<'sap.click', SAPClickActionInput>
| DesktopRunRequest<'sap.doubleClick', SAPClickActionInput>
| DesktopRunRequest<'sap.index', SAPIndexActionInput>
| DesktopRunRequest<'sap.focus', SAPFocusActionInput>
| DesktopRunRequest<'sap.select', SAPSelectActionInput>
| DesktopRunRequest<'sap.openContextMenu', SAPOpenContextMenuActionInput>
| DesktopRunRequest<'sap.selectFromContextMenu', SAPSelectFromContextMenuActionInput>
| DesktopRunRequest<'sap.clickToolbarButton', SAPClickToolbarButtonActionInput>
| DesktopRunRequest<'sap.selectTableRow', SAPSelectTableRowActionInput>
| DesktopRunRequest<'sap.toggleCheckbox', SAPToggleCheckboxActionInput>;

// --- action
export type SAPClickActionInput = {
    target: string;
};
export type SAPClickActionOutput = any;

// --- action
export type SAPIndexActionInput = {
    target: string;
};
export type SAPIndexActionOutput = any;

// --- action
export type SAPFocusActionInput = {
    target: string;
};
export type SAPFocusActionOutput = any;

// --- action
export type SAPReadTextActionInput = {
    target: string;
};
export type SAPReadTextActionOutput = any;

// --- action
export type SAPSendVKeyActionInput = {
    virtualKey: string;
};
export type SAPSendVKeyActionOutput = Record<string, never>;

// --- action
export type SAPConnectActionInput = {
    connectionName: string;
    client: string;
    user: string;
    password: string;
    language?: SAPLanguages;
};
export type SAPConnectActionOutput = Record<string, never>;

// --- action
export type SAPStartTransactionActionInput = {
    transaction: string;
};
export type SAPStartTransactionActionOutput = Record<string, never>;

// --- action
export type SAPTypeActionInput = {
    target: string;
    value: string;
};
export type SAPTypeActionOutput = Record<string, never>;

// --- action
export type SAPSelectActionInput = {
    target: string;
};
export type SAPSelectActionOutput = any;

// --- action
export type SAPOpenContextMenuActionInput = {
    target: string;
    menuId: string;
};
export type SAPOpenContextMenuActionOutput = any;

// --- action
export type SAPSelectFromContextMenuActionInput = {
    target: string;
    optionId: string;
};
export type SAPSelectFromContextMenuActionOutput = any;

// --- action
export type SAPClickToolbarButtonActionInput = {
    target: string;
    toolId: string;
};
export type SAPClickToolbarButtonActionOutput = any;

// --- action
export type SAPToggleCheckboxActionInput = {
    target: string;
    checked: boolean;
};

export interface SAPSelectTableRowActionInput {
    target: string;
    rowIndex: string;
}

export enum SAPLanguages {
    Polish = 'Polish',
    English = 'English',
    Afrikaans = 'Afrikaans',
    Arabic = 'Arabic',
    Bulgarian = 'Bulgarian',
    Catalan = 'Catalan',
    Chinese = 'Chinese',
    Chinese_Traditional = 'Chinese Traditional',
    Croatian = 'Croatian',
    Czech = 'Czech',
    Danish = 'Danish',
    Dutch = 'Dutch',
    Finnish = 'Finnish',
    French = 'French',
    German = 'German',
    Greek = 'Greek',
    Hebrew = 'Hebrew',
    Hungarian = 'Hungarian',
    Icelandic = 'Icelandic',
    Indonesian = 'Indonesian',
    Italian = 'Italian',
    Japanese = 'Japanese',
    Korean = 'Korean',
    Latvian = 'Latvian',
    Lithuanian = 'Lithuanian',
    Malay = 'Malay',
    Norwegian = 'Norwegian',
    Portuguese = 'Portuguese',
    Romanian = 'Romanian',
    Slovene = 'Slovene',
    Slovakian = 'Slovakian',
    Spanish = 'Spanish',
    Swedish = 'Swedish',
    Thai = 'Thai',
    Turkish = 'Turkish',
    Ukrainian = 'Ukrainian',
};

const LanguageCodes: Record<SAPLanguages, string> = {
    [SAPLanguages.Polish]: 'PL',
    [SAPLanguages.English]: 'EN',
    [SAPLanguages.Afrikaans]: 'AF',
    [SAPLanguages.Arabic]: 'AR',
    [SAPLanguages.Bulgarian]: 'BG',
    [SAPLanguages.Catalan]: 'CA',
    [SAPLanguages.Chinese]: 'ZH',
    [SAPLanguages.Chinese_Traditional]: 'ZF',
    [SAPLanguages.Croatian]: 'HR',
    [SAPLanguages.Czech]: 'CS',
    [SAPLanguages.Danish]: 'DA',
    [SAPLanguages.Dutch]: 'NL',
    [SAPLanguages.Finnish]: 'FI',
    [SAPLanguages.French]: 'FR',
    [SAPLanguages.German]: 'DE',
    [SAPLanguages.Greek]: 'EL',
    [SAPLanguages.Hebrew]: 'HE',
    [SAPLanguages.Hungarian]: 'HU',
    [SAPLanguages.Icelandic]: 'IS',
    [SAPLanguages.Indonesian]: 'ID',
    [SAPLanguages.Italian]: 'IT',
    [SAPLanguages.Japanese]: 'JA',
    [SAPLanguages.Korean]: 'KO',
    [SAPLanguages.Latvian]: 'LV',
    [SAPLanguages.Lithuanian]: 'LT',
    [SAPLanguages.Malay]: 'MS',
    [SAPLanguages.Norwegian]: 'NO',
    [SAPLanguages.Portuguese]: 'PT',
    [SAPLanguages.Romanian]: 'RO',
    [SAPLanguages.Slovene]: 'SL',
    [SAPLanguages.Slovakian]: 'SK',
    [SAPLanguages.Spanish]: 'ES',
    [SAPLanguages.Swedish]: 'SV',
    [SAPLanguages.Thai]: 'TH',
    [SAPLanguages.Turkish]: 'TR',
    [SAPLanguages.Ukrainian]: 'UK',
}; 