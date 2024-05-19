const postPredictHandler = require('../server/handler');
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore(); // No need to specify credentials

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 10000000
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getAllDataFromFirestore
  }
];

async function getAllDataFromFirestore(request, h) {
  try {
    const collectionRef = firestore.collection('predictions');
    const snapshot = await collectionRef.get();

    const data = [];
    snapshot.forEach(doc => {
      const docData = doc.data();
      // Customize the structure and add document ID
      const formattedData = {
        id: doc.id,
        history: {
          result: docData.result,
          createdAt: docData.createdAt, // Convert Firestore timestamp to ISO string
          suggestion: docData.suggestion,
          id: doc.id,
        }
      };
      data.push(formattedData);
    });

    return { 
      status: "success",  
      data
     };
  } catch (error) {
    console.error('Error fetching data:', error);
    return h.response({ error: 'Failed to fetch data' }).code(500);
  }
}

module.exports = routes;
