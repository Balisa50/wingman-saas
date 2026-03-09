import { ModeConfig } from '../types'

export const SESSION_MODES: ModeConfig[] = [
  {
    id: 'dating',
    label: 'First Date',
    emoji: '🔥',
    description: 'Real-time rizz coaching. Never run out of things to say.',
    color: '#FF4D6D',
    systemPromptKey: 'dating',
    tips: ['Ask open questions', 'Mirror their energy', 'Use their name'],
  },
  {
    id: 'sales',
    label: 'Sales Call',
    emoji: '💰',
    description: 'Close more deals with live objection handling.',
    color: '#06D6A0',
    systemPromptKey: 'sales',
    tips: ['Listen more than you talk', 'Name their pain', 'Silence is power'],
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    emoji: '🤝',
    description: 'Get what you want. Salary, deals, anything.',
    color: '#118AB2',
    systemPromptKey: 'negotiation',
    tips: ['Anchor high first', 'Never accept first offer', 'Use their words back'],
  },
  {
    id: 'difficult',
    label: 'Hard Conversation',
    emoji: '💬',
    description: 'Navigate emotional or confrontational conversations.',
    color: '#FFB703',
    systemPromptKey: 'difficult',
    tips: ['Stay calm', 'Validate before responding', 'Ask not accuse'],
  },
]
