async function httpRequest(url, method = 'GET', data = undefined) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr.responseText ? JSON.parse(xhr.responseText) : xhr.status);
      }
    };
    xhr.onerror = reject;
    xhr.send(data && JSON.stringify(data));
  });
}

export const httpGet = async url => httpRequest(url);
export const httpPost = async (url, data) => httpRequest(url, 'POST', data);
