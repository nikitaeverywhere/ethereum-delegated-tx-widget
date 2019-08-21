# Ethereum Delegated Transactions Widget

Embeddable widget which performs Ethereum delegated transactions with particular setup. Also, it works as a stand-alone page.

[**---> CHECK IT OUT HERE! <---**](https://http://zitros.github.io/ethereum-delegated-tx-widget/)

Embedding
---------

(...in progress...)

```html
<iframe src="https://http://zitros.github.io/ethereum-delegated-tx-widget/?contractAddress=0x82f4ded9cec9b5750fbff5c2185aee35afc16587&otherParams=abc"
        frameborder="0">
</iframe>
```

**Widget Configuration**:

<table>
<tr>
  <th>URL Parameter</th>
  <th>Required</th>
  <th>Example</th>
  <th>Description</th>
</tr>
<tr>
  <td><code>networkName</code></td>
  <td></td>
  <td><code>mainnet</code></td>
  <td>Required network name</td>
</tr>
<tr>
  <td><code>contractAddress</code></td>
  <td>✔</td>
  <td><code>0x1234..cdef</code></td>
  <td>Smart contract address (usually token address) to perform delegated transaction</td>
</tr>
<tr>
  <td><code>functionName</code></td>
  <td>✔</td>
  <td><code>transfer</code></td>
  <td>Smart contract function name which supports delegated requests</td>
</tr>
<tr>
  <td><code>functionArguments</code></td>
  <td></td>
  <td><code>["0x1aa4..cdaf",20000000]</code></td>
  <td>Arguments of the function as an array (in this example, <code>transfer("0x1aa4..cdaf", 20000000)</code>)</td>
</tr>
<tr>
  <td><code>backEndUrl</code></td>
  <td></td>
  <td><code>https://my-website.com/delegated-tx</code></td>
  <td>Public custom delegated transactions back end (see <a target="_blank" href="https://github.com/ZitRos/ethereum-delegated-tx-service">ethereum-delegated-tx-service</a>). Otherwise, pre-defined back end is used.</td>
</tr>
</table>

Development
-----------

To start development server, run the following:

```bash
npm install
npm run start
```

To build the project, run

```bash
npm run build
```
