/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

const axios = require('axios');

module.exports = async function oldestPackageName() {
  //receive data and save
  const name = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
  }).then(data => data.data.content)
    .then(content => content.reduce((accu, entry) => {
      //compare current date and the accumulator
      return new Date(accu.date) <= new Date(entry.package.date) ? accu : entry.package
    }))
    //return the name of the oldest date
    .then(oldest => oldest.name)

  return name
};
