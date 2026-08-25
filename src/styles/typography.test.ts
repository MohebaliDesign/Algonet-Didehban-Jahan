import { describe, expect, it } from 'vitest'

import foundationStyles from './foundation.css?raw'
import productStyles from './product.css?raw'
import typographyStyles from './typography.css?raw'

const styles = [productStyles, foundationStyles, typographyStyles].join('\n')

describe('product typography contract', () => {
  it('contains no visible raw font sizes below 12px', () => {
    const undersized = styles.match(
      /font-size:\s*(?:[0-9]|10|11)px|font:\s*[^;]*\b(?:[0-9]|10|11)px\b/g,
    )

    expect(undersized).toBeNull()
  })

  it('caps the semantic display role at 40px', () => {
    expect(styles).toContain('--type-display-size: 40px')
    expect(styles).not.toMatch(/font-size:\s*(?:4[1-9]|[5-9][0-9])px/)
  })
})
