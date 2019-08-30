# Ethereum Delegated Transactions Widget

Emendable widget which performs Ethereum delegated transactions with particular setup. Also works as a stand-alone page.

Delegated transactions back end is yet to be open-sourced soon.

[**---> CHECK IT OUT HERE! <---**](https://zitros.github.io/ethereum-delegated-tx-widget/)

Embedding
---------

```html
<iframe src="https://zitros.github.io/ethereum-delegated-tx-widget/?contractAddress=0x82f4ded9cec9b5750fbff5c2185aee35afc16587&otherParams=abc"
        frameborder="0">
</iframe>
```

**Widget Configuration**:

<table>
<tr>
  <th>URL Parameter</th>
  <th>Default</th>
  <th>Example</th>
  <th>Description</th>
</tr>
<tr>
  <td><code>fixed</code></td>
  <td><code>false</code></td>
  <td><code>true</code></td>
  <td>Disable all inputs</td>
</tr>
<tr>
  <td><code>contractAddress</code></td>
  <td><a href="https://etherscan.io/token/0x82f4ded9cec9b5750fbff5c2185aee35afc16587">0x82f4ded..fc16587</a></td>
  <td><code>0x1234..cdef</code></td>
  <td>Smart contract address (usually token address) which is supported by at least one back end</td>
</tr>
<tr>
  <td><code>functionName</code></td>
  <td><code>transfer</code></td>
  <td><code>transfer</code></td>
  <td>Smart contract function name which is supported by at least one back end</td>
</tr>
<tr>
  <td><code>functionArguments</code></td>
  <td><code>0x17A8..a29D,1000000</code></td>
  <td><code>0x1aa4..cdaf,20000000</code></td>
  <td>Comma-separated arguments of the function (in this example, <code>transfer("0x1aa4..cdaf", 20000000)</code>)</td>
</tr>
<tr>
  <td><code>customBackEnds</code></td>
  <td><code></code></td>
  <td><code>my-website.com/api/kovan,my-website.com/api/mainnet</code></td>
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

To build and deploy the project to GitHub (access is restricted), run

```bash
npm run deploy
```
