async function httpRequest(url, method = 'GET', data = undefined) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        if (!xhr.responseText) {
          reject(`HTTPCODE ${xhr.status}`);
          return;
        }
        try {
          const parsed = JSON.parse(xhr.responseText);
          reject(
            (parsed && (parsed.error || parsed)) ||
              `HTTPCODE ${xhr.status}, ${xhr.responseText}`
          );
          return;
        } catch (e) {
          reject(xhr.responseText);
        }
      }
    };
    xhr.onerror = () => reject('request failed');
    xhr.send(data && JSON.stringify(data));
  });
}

export const httpGet = async url => httpRequest(url);
export const httpPost = async (url, data) => httpRequest(url, 'POST', data);
