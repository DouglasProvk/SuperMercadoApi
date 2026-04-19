module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        supergestao: {
          primary: '#1abc9c',
          secondary: '#3498db',
          accent: '#f39c12',
          neutral: '#f6f6f6',
        },
      },
    ],
  },
}
