const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const imageSize = image.length;

  const maxImageSize = 1024 * 1024;
  if (imageSize > maxImageSize) {
    return h.response({ 
      status: "fail", 
      message: "Payload content length greater than maximum allowed: 1000000" })
      .code(413);
  }

  const { confidenceScore } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "result": confidenceScore > 99 ? 'Cancer' : 'Non-cancer',
    "createdAt": createdAt,
    "suggestion": confidenceScore > 99 ? 'Segera periksa ke dokter!' : 'Anda sehat!',
    "id": id,
  }
  await storeData(id, data);
  
  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully' : 'Model is predicted successfully',
    data 
  })
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;