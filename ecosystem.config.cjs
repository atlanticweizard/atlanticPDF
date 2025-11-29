module.exports = {
  apps: [{
    name: 'atlantic-web',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'postgresql://atlantic_user:83XwW5NiJUiqJi3NPL8yWF@localhost:5432/atlantic_weizard?sslmode=disable',
      PAYU_MERCHANT_KEY: 'IElZot',
      PAYU_MERCHANT_SALT: 'g92t0uxoEhGt6t4FHbGdFTfAJS1S9tcm',
      PAYU_MODE: 'LIVE',
      RESEND_API_KEY: 're_7ksBRGAL_FQjrc3ayWQtbNp6AioYrTvkZ',
      EMAIL_FROM: 'noreply@atlanticweizard.dpdns.org',
      SESSION_SECRET: '8f3a9c2e1d7b4f6a8c9e0d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      BASE_URL: 'https://atlanticweizard.dpdns.org',
      TRUST_PROXY: 'true'
    }
  }]
};
