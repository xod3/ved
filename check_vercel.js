const https = require('https');

function check() {
  const req = https.request({
    host: '76.76.21.21',
    servername: 'www.vedcourier.online',
    headers: { 'Host': 'www.vedcourier.online' },
    rejectUnauthorized: false
  }, res => {
    console.log('HTTP Status:', res.statusCode);
    console.log('x-vercel-id:', res.headers['x-vercel-id']);
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const titleMatch = body.match(/<title>([^<]+)<\/title>/);
      console.log('Page Title:', titleMatch ? titleMatch[1] : 'No title tag');
      if (res.statusCode === 200) {
        console.log('DEPLOYMENT SUCCESS! LIVE ON VERCEL!');
      }
    });
  });

  req.on('error', err => {
    console.error('Request error:', err.message);
  });

  req.end();
}

check();
