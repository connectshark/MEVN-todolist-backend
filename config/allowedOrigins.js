const allowedOrigins = (process.env.ENV === 'development') ? [
	'http://localhost:8080'
] : [
  'https://connectshark.github.io/'
]

module.exports = allowedOrigins