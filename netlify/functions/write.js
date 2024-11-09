const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { msg } = event.queryStringParameters || {};

  if (!msg) {
    return {
      statusCode: 400,
      body: "Geçerli bir 'msg' parametresi belirtilmedi.",
    };
  }

  const filePath = path.resolve(__dirname, '../../public/detay.txt');
  const message = `${msg}\n`;

  try {
    fs.appendFileSync(filePath, message, 'utf8');
    return {
      statusCode: 200,
      body: 'ok',
    };
  } catch (error) {
    console.error("Dosyaya yazılamadı:", error);
    return {
      statusCode: 500,
      body: 'Dosyaya yazarken bir hata oluştu.',
    };
  }
};