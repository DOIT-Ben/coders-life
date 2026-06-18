import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const SESSION_ROOT = 'C:\\Users\\HB\\.codex\\sessions\\2026\\06';
const TARGET_AGENTS = new Map([
  ['019ed89b-1967-7613-94f7-e4dd5bb9aa18', {
    name: 'agent-research-life-round12-candidates',
    output: path.join(ROOT, 'workbench', 'agent-research-life-round12-candidates.md')
  }],
  ['019ed89b-19ec-76a3-b3d8-eec37f83f6f9', {
    name: 'agent-research-learning-round13-candidates',
    output: path.join(ROOT, 'workbench', 'agent-research-learning-round13-candidates.md')
  }]
]);

const allowedActions = new Set(['rest', 'overtime', 'networking', 'interview', 'side-project', 'learn-ai']);
const allowedTones = new Set(['resonant', 'gentle', 'wry', 'sharp']);
const allowedKinds = new Set(['health', 'life', 'learning', 'event']);

function listSessionFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSessionFiles(fullPath));
    } else if (entry.isFile() && entry.name.startsWith('rollout-') && entry.name.endsWith('.jsonl')) {
      files.push(fullPath);
    }
  }
  return files;
}

function readRows(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL session row ${index + 1}: ${error.message}`);
      }
    });
}

function extractSessionMetaAgentId(row) {
  const id = row?.payload?.id;
  const source = row?.payload?.source;
  if (row?.type !== 'session_meta' || !TARGET_AGENTS.has(id)) return null;
  if (source?.subagent || row?.payload?.thread_source === 'subagent') return id;
  return null;
}

function extractTextFragments(row) {
  const fragments = [];
  if (row?.type === 'event_msg' && typeof row?.payload?.message === 'string') {
    fragments.push(row.payload.message);
  }
  if (row?.type === 'response_item' && row?.payload?.type === 'message' && Array.isArray(row?.payload?.content)) {
    for (const item of row.payload.content) {
      if (typeof item?.text === 'string') fragments.push(item.text);
      if (typeof item?.input_text === 'string') fragments.push(item.input_text);
      if (typeof item?.output_text === 'string') fragments.push(item.output_text);
    }
  }
  return fragments;
}

function extractCompletedText(row) {
  const text = row?.payload?.content?.[0]?.text;
  if (typeof text !== 'string' || !text.includes('<subagent_notification>')) return null;
  const start = text.indexOf('{', text.indexOf('<subagent_notification>'));
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const notification = JSON.parse(text.slice(start, end + 1));
    const completed = notification?.status?.completed;
    if (!TARGET_AGENTS.has(notification?.agent_path) || typeof completed !== 'string') return null;
    return { agentId: notification.agent_path, completed };
  } catch {
    return null;
  }
}

function extractJsonlBlocks(text) {
  const blocks = [];
  const pattern = /```jsonl\s*([\s\S]*?)```/g;
  let match = null;
  while ((match = pattern.exec(text)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

function parseCandidateLines(blocks, agentId) {
  const candidates = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    for (const line of lines) {
      const entry = JSON.parse(line);
      assert.ok(allowedActions.has(entry.action), `${agentId} invalid action: ${entry.action}`);
      assert.ok(typeof entry.text === 'string' && entry.text.length >= 12, `${agentId} invalid text`);
      assert.ok(allowedTones.has(entry.tone), `${agentId} invalid tone: ${entry.tone}`);
      assert.ok(allowedKinds.has(entry.kind), `${agentId} invalid kind: ${entry.kind}`);
      assert.ok(typeof entry.category === 'string' && entry.category, `${agentId} invalid category`);
      candidates.push(entry);
    }
  }
  return candidates;
}

function normalizeText(text) {
  return text.replace(/[，。！？、：；“”"'\s]/g, '').toLowerCase();
}

function writeCandidateFile(target, completed, candidates) {
  const sources = completed
    .split(/\r?\n/)
    .filter(line => line.trim().startsWith('- '))
    .slice(0, 20);
  const body = [
    `# ${target.name}`,
    '',
    '来源：从当前 Codex 会话子智能体 completed 通知抽取，候选内容为原创改写，不直接进入正式运行时池。',
    '',
    '## 调研来源摘要',
    '',
    ...sources,
    '',
    '## JSONL 候选',
    '',
    '```jsonl',
    ...candidates.map(candidate => JSON.stringify(candidate)),
    '```',
    ''
  ].join('\n');
  fs.writeFileSync(target.output, body, 'utf8');
}

const extracted = new Map();
const sessionFiles = listSessionFiles(SESSION_ROOT);
for (const filePath of sessionFiles) {
  let currentAgentId = null;
  for (const row of readRows(filePath)) {
    currentAgentId = currentAgentId || extractSessionMetaAgentId(row);
    const notificationItem = extractCompletedText(row);
    const items = [];
    if (notificationItem) items.push(notificationItem);
    if (currentAgentId) {
      for (const text of extractTextFragments(row)) {
        if (text.includes('```jsonl')) {
          items.push({ agentId: currentAgentId, completed: text });
        }
      }
    }
    for (const item of items) {
      const blocks = extractJsonlBlocks(item.completed);
      const candidates = parseCandidateLines(blocks, item.agentId);
      if (candidates.length > 0 && (!extracted.has(item.agentId) || candidates.length > extracted.get(item.agentId).candidates.length)) {
        extracted.set(item.agentId, { completed: item.completed, candidates, source: filePath });
      }
    }
  }
}

const globalSeen = new Set();
const summary = [];
for (const [agentId, target] of TARGET_AGENTS.entries()) {
  const item = extracted.get(agentId);
  assert.ok(item, `Missing completed JSONL block for ${agentId}`);
  const localSeen = new Set();
  const duplicates = [];
  for (const candidate of item.candidates) {
    const normalized = normalizeText(candidate.text);
    if (localSeen.has(normalized) || globalSeen.has(normalized)) duplicates.push(candidate.text);
    localSeen.add(normalized);
    globalSeen.add(normalized);
  }
  assert.deepEqual(duplicates, [], `${agentId} duplicate candidate texts:\n${duplicates.join('\n')}`);
  writeCandidateFile(target, item.completed, item.candidates);
  summary.push({
    agentId,
    output: target.output,
    source: item.source,
    count: item.candidates.length,
    categories: Object.fromEntries(
      Object.entries(item.candidates.reduce((acc, candidate) => {
        acc[candidate.category] = (acc[candidate.category] || 0) + 1;
        return acc;
      }, {})).sort((left, right) => left[0].localeCompare(right[0], 'zh-Hans-CN'))
    )
  });
}

console.log(JSON.stringify({ extracted: summary }, null, 2));
