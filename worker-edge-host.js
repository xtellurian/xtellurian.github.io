export default {
    async fetch(request) {
      /**
       * An object with different URLs to fetch
       * @param {Object} ORIGINS
       */
      const ORIGINS = {
        "rian.xyz": "rianxyz.azurewebsites.net",
        "www.rian.xyz": "rianxyz.azurewebsites.net",
        "worker-edge-host.flanagan89.workers.dev": "rianxyz.azurewebsites.net"
      };
  
      const url = new URL(request.url);
  
      // Check if incoming hostname is a key in the ORIGINS object
      if (url.hostname in ORIGINS) {
        const target = ORIGINS[url.hostname];
        url.hostname = target;
        // If it is, proxy request to that third party origin
        return fetch(url.toString(), request);
      }
      // Otherwise, process request as normal
      return fetch(request);
    },
  };