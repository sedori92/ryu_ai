const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. .env 파일 수동 로드
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/(^"|"$)/g, '').replace(/\\n/g, '\n');
      } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.replace(/(^'|'$)/g, '');
      }
      process.env[key] = value;
    }
  });
  console.log('✅ .env 환경변수 로드 완료');
}

const analyzeApi = require('./api/analyze');

const PORT = process.env.PORT || 3000;

// MIME 타입 매핑
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
};

// 2. HTTP 서버 생성
const server = http.createServer((req, res) => {
  console.log(`[${req.method}] ${req.url}`);

  // API 요청 라우팅
  if (req.url === '/api/analyze') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        // Vercel Serverless Function을 위해 req.body 및 res.status, res.json 모킹
        req.body = body ? JSON.parse(body) : {};
        
        res.status = function(code) {
          res.statusCode = code;
          return res;
        };
        
        res.json = function(data) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(data));
        };

        // 실제 API 로직 호출
        analyzeApi(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: true, message: '서버 파싱 에러' }));
      }
    });
    return;
  }

  // 정적 파일(화면 HTML, CSS, JS) 서빙 로직
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1><p>해당 파일을 찾을 수 없습니다.</p>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`서버 에러: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 서버 실행
server.listen(PORT, () => {
  console.log(`\n🚀 로컬 테스트 서버가 실행되었습니다!`);
  console.log(`👉 브라우저를 열고 아래 주소로 접속해주세요:`);
  console.log(`   http://localhost:${PORT}\n`);
});
