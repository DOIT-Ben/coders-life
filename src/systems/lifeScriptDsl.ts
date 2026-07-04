import { ACTIONS } from '../config/actions';

export type LifeScriptField =
  | 'morale'
  | 'health'
  | 'burnout'
  | 'cash'
  | 'tech'
  | 'ai'
  | 'relation'
  | 'month'
  | 'age'
  | 'cashflowStress'
  | 'careerRisk'
  | 'healthDebt'
  | 'employed'
  | 'jobless'
  | 'activeInterview'
  | 'activeOffer'
  | 'inCrisis';

export type LifeScriptComparisonOperator = '<' | '<=' | '>' | '>=' | '=' | '!=';
export type LifeScriptBinaryOperator = 'and' | 'or';

export interface LifeScriptComparisonCondition {
  kind: 'comparison';
  field: LifeScriptField;
  operator: LifeScriptComparisonOperator;
  value: number;
}

export interface LifeScriptFlagCondition {
  kind: 'flag';
  field: LifeScriptField;
  expected: boolean;
}

export interface LifeScriptBinaryCondition {
  kind: 'binary';
  operator: LifeScriptBinaryOperator;
  left: LifeScriptCondition;
  right: LifeScriptCondition;
}

export type LifeScriptCondition = LifeScriptComparisonCondition | LifeScriptFlagCondition | LifeScriptBinaryCondition;

export interface LifeScriptWhenRule {
  kind: 'when';
  condition: LifeScriptCondition;
  actionIds: string[];
  source: string;
}

export interface LifeScriptFallbackRule {
  kind: 'fallback';
  actionIds: string[];
  source: string;
}

export type LifeScriptRule = LifeScriptWhenRule | LifeScriptFallbackRule;

export interface LifeScriptProgram {
  rules: LifeScriptRule[];
}

export type LifeScriptParseResult =
  | { ok: true; program: LifeScriptProgram }
  | { ok: false; errors: string[] };

const MAX_SOURCE_LENGTH = 12000;
const MAX_LINE_LENGTH = 400;

const CODE_LIKE_PATTERNS = [
  /\beval\b/i,
  /\bFunction\b/,
  /\bimport\b/,
  /\bwindow\b/,
  /\bdocument\b/,
  /\blocalStorage\b/,
  /\bfetch\b/,
  /\./,
  /;/,
  /\{/,
  /\}/,
  /\(\s*\)\s*=>/
];

const FIELD_NAMES: Record<string, LifeScriptField> = {
  精神: 'morale',
  健康: 'health',
  燃尽: 'burnout',
  现金: 'cash',
  技术: 'tech',
  AI协作: 'ai',
  关系: 'relation',
  月份: 'month',
  年龄: 'age',
  现金流压力: 'cashflowStress',
  职业风险: 'careerRisk',
  健康债: 'healthDebt'
};

const FLAG_NAMES: Record<string, LifeScriptField> = {
  在职: 'employed',
  待业: 'jobless',
  '当前面试 可用': 'activeInterview',
  '当前offer 可用': 'activeOffer',
  危机中: 'inCrisis'
};

const CONDITION_OPERATORS: LifeScriptComparisonOperator[] = ['<=', '>=', '!=', '<', '>', '='];
const ACTION_NAME_TO_ID = new Map(ACTIONS.map(action => [action.name, action.id]));

export function parseLifeScript(source: string): LifeScriptParseResult {
  const errors: string[] = [];
  const rules: LifeScriptRule[] = [];

  if (source.length > MAX_SOURCE_LENGTH) {
    return { ok: false, errors: ['脚本太长了，请拆成更短的规则。'] };
  }

  if (CODE_LIKE_PATTERNS.some(pattern => pattern.test(source))) {
    errors.push('脚本只能使用规则语法，不能包含代码执行片段。');
  }

  source.split(/\r?\n/).forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line) return;

    if (line.length > MAX_LINE_LENGTH) {
      errors.push(`第 ${lineNumber} 行：这一行太长了，请拆成多条规则。`);
      return;
    }

    if (line.startsWith('当 ')) {
      const separatorIndex = line.indexOf(' 则 ');
      if (separatorIndex === -1) {
        errors.push(`第 ${lineNumber} 行：规则需要写成“当 条件 则 行动”。`);
        return;
      }

      const conditionSource = line.slice(2, separatorIndex).trim();
      const actionsSource = line.slice(separatorIndex + 3).trim();
      const condition = parseCondition(conditionSource, lineNumber, errors);
      const actionIds = parseActions(actionsSource, lineNumber, errors);

      if (condition && actionIds.length > 0) {
        rules.push({ kind: 'when', condition, actionIds, source: line });
      }
      return;
    }

    if (line.startsWith('否则')) {
      const actionIds = parseActions(line.slice(2).trim(), lineNumber, errors);
      if (actionIds.length > 0) {
        rules.push({ kind: 'fallback', actionIds, source: line });
      }
      return;
    }

    errors.push(`第 ${lineNumber} 行：只支持“当 条件 则 行动”或“否则 行动”。`);
  });

  const validationErrors = validateLifeScript({ rules });
  errors.push(...validationErrors);

  return errors.length > 0 ? { ok: false, errors: unique(errors) } : { ok: true, program: { rules } };
}

export function validateLifeScript(program: LifeScriptProgram): string[] {
  const errors: string[] = [];
  for (const rule of program.rules) {
    if (rule.actionIds.length === 0) {
      errors.push(`规则“${rule.source}”没有可执行行动。`);
    }
  }
  return errors;
}

function parseCondition(source: string, lineNumber: number, errors: string[]): LifeScriptCondition | undefined {
  const connector = findConnector(source);
  if (connector) {
    const left = parseCondition(source.slice(0, connector.index).trim(), lineNumber, errors);
    const right = parseCondition(source.slice(connector.index + connector.text.length).trim(), lineNumber, errors);
    if (!left || !right) return undefined;
    return { kind: 'binary', operator: connector.operator, left, right };
  }

  const flagField = FLAG_NAMES[source];
  if (flagField) return { kind: 'flag', field: flagField, expected: true };

  const operator = CONDITION_OPERATORS.find(candidate => source.includes(candidate));
  if (!operator) {
    const unknownField = source.split(/\s+/)[0] || source;
    errors.push(`第 ${lineNumber} 行：暂不支持条件“${unknownField}”。`);
    return undefined;
  }

  const [fieldSource, valueSource] = splitOnce(source, operator).map(part => part.trim());
  const field = FIELD_NAMES[fieldSource];
  if (!field) {
    errors.push(`第 ${lineNumber} 行：暂不支持条件“${fieldSource}”。`);
    return undefined;
  }

  const value = Number(valueSource);
  if (!Number.isFinite(value)) {
    errors.push(`第 ${lineNumber} 行：条件“${fieldSource}”需要填写数字。`);
    return undefined;
  }

  return { kind: 'comparison', field, operator, value };
}

function findConnector(source: string): { index: number; text: string; operator: LifeScriptBinaryOperator } | undefined {
  const andIndex = source.indexOf(' 并且 ');
  const orIndex = source.indexOf(' 或者 ');
  const indexes = [
    andIndex >= 0 ? { index: andIndex, text: ' 并且 ', operator: 'and' as const } : undefined,
    orIndex >= 0 ? { index: orIndex, text: ' 或者 ', operator: 'or' as const } : undefined
  ].filter((item): item is { index: number; text: string; operator: LifeScriptBinaryOperator } => Boolean(item));

  return indexes.sort((a, b) => a.index - b.index)[0];
}

function parseActions(source: string, lineNumber: number, errors: string[]): string[] {
  if (!source) {
    errors.push(`第 ${lineNumber} 行：请填写要执行的行动。`);
    return [];
  }

  const actionNames = source.split(/[、，]/).map(name => name.trim()).filter(Boolean);
  const actionIds: string[] = [];
  for (const name of actionNames) {
    const actionId = ACTION_NAME_TO_ID.get(name);
    if (!actionId) {
      errors.push(`第 ${lineNumber} 行：找不到行动“${name}”。`);
      continue;
    }
    actionIds.push(actionId);
  }
  return actionIds;
}

function splitOnce(source: string, separator: string): [string, string] {
  const index = source.indexOf(separator);
  return [source.slice(0, index), source.slice(index + separator.length)];
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
