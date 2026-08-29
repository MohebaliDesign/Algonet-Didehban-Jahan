import { describe, expect, it } from 'vitest'

const sourceFiles = import.meta.glob<string>('../**/*.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const forbiddenPrimitives = ['button', 'input', 'select', 'textarea', 'table', 'dialog', 'progress']

describe('shadcn component-library guardrail', () => {
  it('does not use native interactive primitives outside components/ui', () => {
    const violations = Object.entries(sourceFiles).flatMap(([file, source]) => {
      if (file.includes('/components/ui/')) return []
      if (file.includes('.test.') || file.includes('.spec.')) return []

      return forbiddenPrimitives.flatMap((tag) => {
        const matches = source.match(new RegExp(`<${tag}\\b`, 'g')) ?? []
        return matches.map(() => `${file}: <${tag}>`)
      })
    })

    expect(
      violations,
      [
        'Use shadcn primitives from @/components/ui instead of native interactive elements.',
        'If a primitive is intentionally low-level, keep that implementation inside src/components/ui.',
        ...violations,
      ].join('\n'),
    ).toEqual([])
  })
})
