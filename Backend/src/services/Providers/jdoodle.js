const axios = require('axios');

const execute = async (wrappedCode, language = 'java') => {
  const response = await axios.post('https://api.jdoodle.com/v1/execute', {
    clientId:     process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script:       wrappedCode,
    language:     'java',
    versionIndex: '5',  // JDK 21
  });

  const data   = response.data;
  const stdout = data.output || '';

  if (data.error) throw new Error(data.error);

  return { stdout, memory: data.memory || null };
};

module.exports = { execute };