# Ethereum Delegated Transactions Widget

Elegant Ethereum delegated transactions implementation.

Primarily, delegated transactions, or meta transactions allow users to pay fee in tokens instead of Ether, making crypto user experience great again. This widget is shipped with the [back end](https://github.com/ZitRos/ethereum-delegated-tx-service), which can be used for any token or smart contract supporting doing-something-via-signature.

+ Highly customizable widget and a stand-alone page
+ Can work **with any token** which supports function delegation (but you have to set up a back end for it)
+ Helpful hints, which allow to quickly onboard inexperienced users
+ Signature standard-free paradigm (use any signature your contract supports, e.g. `eth_personalSign`, `eth_signTypedData`)
+ Automatically picks an icon of your token (from Trust Wallet repository)

<p align="center">
  <br/><b><a href="https://zitros.github.io/ethereum-delegated-tx-widget/" target="_blank">→ CHECK THE DEMO HERE! ←</a></b><br/><br/>
  <img src="https://user-images.githubusercontent.com/4989256/64173367-cbec8080-ce5f-11e9-87c3-c1c77ae83dc4.png" alt="screenshot" width="360"><br/><br/>
  Need test tokens? Use this widget via <a href="https://zitros.github.io/ethereum-delegated-tx-widget/?contractAddress=0xcc7e25e30b065ea61814bec6ecdb17edb0f891aa" target="_blank">this link</a>
  and
  <a href="https://kovan.etherscan.io/address/0xcc7e25e30b065ea61814bec6ecdb17edb0f891aa#writeContract" target="_blank">mint some test tokens</a> in Kovan network<br/>by calling <code>mintTokens</code> function (mints 10 tokens to a calling account). <br/>Need some Ether in Kovan? <a href="https://www.google.com/search?q=kovan+ether+faucet" target="_blank">Find</a> any faucet that can give you some.
</p>

Embedding
---------

```html
<iframe src="https://zitros.github.io/ethereum-delegated-tx-widget/?contractAddress=0x82f4ded9cec9b5750fbff5c2185aee35afc16587&otherParams=abc"
        frameborder="0">
</iframe>
```

**Widget Customization**:

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
  <td><code><a href="https://etherscan.io/token/0x82f4ded9cec9b5750fbff5c2185aee35afc16587">0x82f4ded..fc16587</a></code></td>
  <td><code>0x1234..cdef</code></td>
  <td>Smart contract address (usually token address) which is supported by at least one back end</td>
</tr>
<tr>
  <td><code>functionName</code></td>
  <td><code>transfer</code></td>
  <td><code>approveAndCall</code></td>
  <td>Smart contract function name which is supported by at least one back end</td>
</tr>
<tr>
  <td><code>functionArguments</code></td>
  <td><code>0x17A8..a29D,1000000</code></td>
  <td><code>0x1aa4..cdaf,20000000</code></td>
  <td>Comma-separated arguments of the function (in this example, <code>transfer("0x1aa4..cdaf", 20000000)</code>).</td>
</tr>
<tr>
  <td><code>customBackEnds</code></td>
  <td></td>
  <td><code>my-website.com/api/kovan,my-website.com/api/mainnet</code></td>
  <td>Public custom delegated transactions back end (see <a target="_blank" href="https://github.com/ZitRos/ethereum-delegated-tx-service">ethereum-delegated-tx-service</a>). Otherwise, pre-defined back end is used.</td>
</tr>
<tr>
  <td><code>successRedirectUrl</code></td>
  <td></td>
  <td><code>my-website.com/handle-redirect</code></td>
  <td>URL the user is redirected to once the transaction is mined.</td>
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
