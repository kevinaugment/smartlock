/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand Primary - Professional Blue
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Accent - Tech Orange
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Success Green
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Warning Yellow
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger Red
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            lineHeight: '1.75',
            
            // Headings
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '800',
              fontSize: theme('fontSize.4xl[0]'),
              lineHeight: theme('fontSize.4xl[1].lineHeight'),
              marginTop: '0',
              marginBottom: theme('spacing.6'),
              letterSpacing: '-0.025em',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              fontSize: theme('fontSize.3xl[0]'),
              lineHeight: theme('fontSize.3xl[1].lineHeight'),
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.4'),
              letterSpacing: '-0.025em',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              fontSize: theme('fontSize.2xl[0]'),
              lineHeight: theme('fontSize.2xl[1].lineHeight'),
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.3'),
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: theme('fontSize.xl[0]'),
              lineHeight: theme('fontSize.xl[1].lineHeight'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.2'),
            },
            h5: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: theme('fontSize.lg[0]'),
              lineHeight: theme('fontSize.lg[1].lineHeight'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.2'),
            },
            h6: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: theme('fontSize.base[0]'),
              lineHeight: theme('fontSize.base[1].lineHeight'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.2'),
            },
            
            // Paragraphs
            p: {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
            },
            
            // Links
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: `1px solid ${theme('colors.primary.300')}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme('colors.primary.700'),
                borderBottomColor: theme('colors.primary.600'),
              },
            },
            
            // Strong and emphasis
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },
            em: {
              fontStyle: 'italic',
            },
            
            // Code
            code: {
              color: theme('colors.pink.600'),
              backgroundColor: theme('colors.gray.100'),
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '500',
              fontFamily: theme('fontFamily.mono').join(', '),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            
            // Code blocks
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              overflowX: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.7',
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
              borderRadius: theme('borderRadius.xl'),
              padding: theme('spacing.6'),
              border: `2px solid ${theme('colors.gray.800')}`,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              fontFamily: theme('fontFamily.mono').join(', '),
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: '400',
              padding: '0',
              borderRadius: '0',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            // Syntax highlighting tokens (if using Shiki or Prism)
            '.token.comment': {
              color: theme('colors.gray.500'),
              fontStyle: 'italic',
            },
            '.token.keyword': {
              color: theme('colors.purple.400'),
            },
            '.token.string': {
              color: theme('colors.green.400'),
            },
            '.token.function': {
              color: theme('colors.blue.400'),
            },
            '.token.number': {
              color: theme('colors.orange.400'),
            },
            '.token.operator': {
              color: theme('colors.pink.400'),
            },
            
            // Blockquotes
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: theme('colors.gray.700'),
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.primary.400'),
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              paddingLeft: theme('spacing.5'),
              backgroundColor: theme('colors.blue.50'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.md'),
            },
            'blockquote p': {
              marginTop: '0',
              marginBottom: '0',
            },
            
            // Lists
            ul: {
              listStyleType: 'disc',
              paddingLeft: theme('spacing.6'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: theme('spacing.6'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
            },
            li: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
              paddingLeft: theme('spacing.1'),
            },
            'li::marker': {
              color: theme('colors.primary.500'),
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
            },
            
            // Tables
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
              fontSize: '0.875rem',
              lineHeight: '1.7142857',
              borderCollapse: 'separate',
              borderSpacing: '0',
              borderRadius: theme('borderRadius.lg'),
              overflow: 'hidden',
              border: `1px solid ${theme('colors.gray.200')}`,
            },
            thead: {
              backgroundColor: theme('colors.gray.50'),
              borderBottomWidth: '2px',
              borderBottomColor: theme('colors.gray.300'),
            },
            'thead th': {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              verticalAlign: 'bottom',
              paddingRight: theme('spacing.3'),
              paddingBottom: theme('spacing.3'),
              paddingLeft: theme('spacing.3'),
              paddingTop: theme('spacing.3'),
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.gray.200'),
              transition: 'background-color 0.2s ease',
            },
            'tbody tr:hover': {
              backgroundColor: theme('colors.gray.50'),
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              verticalAlign: 'baseline',
              paddingRight: theme('spacing.3'),
              paddingBottom: theme('spacing.3'),
              paddingLeft: theme('spacing.3'),
              paddingTop: theme('spacing.3'),
            },
            'tbody td:first-child': {
              fontWeight: '500',
              color: theme('colors.gray.900'),
            },
            
            // Horizontal rule
            hr: {
              borderColor: theme('colors.gray.200'),
              borderTopWidth: 1,
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.12'),
            },
            
            // Images
            img: {
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
              borderRadius: theme('borderRadius.lg'),
            },
            
            // Figure
            figure: {
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
            },
            figcaption: {
              color: theme('colors.gray.500'),
              fontSize: '0.875rem',
              lineHeight: '1.4285714',
              marginTop: theme('spacing.3'),
              textAlign: 'center',
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: theme('fontSize.5xl[0]'),
              lineHeight: '1.1',
              marginBottom: theme('spacing.8'),
            },
            h2: {
              fontSize: theme('fontSize.4xl[0]'),
              lineHeight: theme('fontSize.4xl[1].lineHeight'),
              marginTop: theme('spacing.16'),
              marginBottom: theme('spacing.6'),
            },
            h3: {
              fontSize: theme('fontSize.3xl[0]'),
              lineHeight: theme('fontSize.3xl[1].lineHeight'),
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.4'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
