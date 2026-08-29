import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sourceRoot = resolve(process.cwd(), 'src')
const uiRoot = resolve(sourceRoot, 'components/ui')

const forbiddenPrimitives = ['button', 'input', 'select', 'textarea', 'table', 'dialog', 'progress']

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    const stats = statSync(path)

    if (stats.isDirectory()) return collectSourceFiles(path)
    if (!path.endsWith('.tsx')) return []
    if (path.includes('.test.') || path.includes('.spec.')) return []
    if (path.startsWith(uiRoot)) return []

    return [path]
  })
}

describe('shadcn component-library guardrail', () => {
  it('does not use native interactive primitives outside components/ui', () => {
    const violations = collectSourceFiles(sourceRoot).flatMap((path) => {
      const source = readFileSync(path, 'utf8')
      const file = relative(process.cwd(), path)

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
