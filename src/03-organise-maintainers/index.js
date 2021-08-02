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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

const axios = require('axios');

module.exports = async function organiseMaintainers() {
  //receive data and save
  const name = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
  }).then(data => data.data.content)
  let packageList = [];
  const maintainers = [];
  //iterate every package names
  name.map(entry => {
    const packageNames = entry.package.name
    //iterate every maintainers
    entry.package.maintainers.map(mName => {
      //if username exists, add packageNames to array, else create the username to passed at
      packageList[mName.username] ? packageList[mName.username].push(packageNames) : packageList[mName.username] = [packageNames]
    });
  })
  //trun raw data into information
  for (const [key, val] of Object.entries(packageList)) {
    maintainers.push({ username: key, packageNames: val.sort() })
  }
  //sorting for username
  maintainers.sort((a, b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0))

  return maintainers
};
