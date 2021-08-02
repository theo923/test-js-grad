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
  const name = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
  }).then(data => data.data.content)
  let packageList = [];
  const maintainers = [];
  name.map(entry => {
    const packageNames = entry.package.name
    entry.package.maintainers.map(mName => {
      packageList[mName.username] ? packageList[mName.username].push(packageNames) : packageList[mName.username] = [packageNames]
    });
  })
  for (const [key, val] of Object.entries(packageList)) {
    maintainers.push({ username: key, packageNames: val.sort() })
  }
  maintainers.sort((a, b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0))

  return maintainers
};
