# EOSIO BP Information Standard
**JSON Standard for Block Producer Information on EOSIO Blockchains**

This is a proposed standard for Block Producer candidates to publish as the URL field of the `regproducer` action on the `eosio.system` contract.

The current revision **v1.0.1** is compliant with the JSON schema [Draft 2019-09](https://json-schema.org/specification-links.html#2019-09-formerly-known-as-draft-8)

- producer_account_name: Name of producer account
- org: {Object}
  - candidate_name: Producer/organization name
  - website: Block producer website
  - code_of_conduct: Full URL to page,
  - ownership_disclosure: Full URL to page,
  - email: Contact email
  - github_user: Operational github username (or array or usernames)
  - chain_resources: Website with chain related resources (snapshots & backups)
  - other_resources: [Array] - List of other relevant URLs 
  - branding: {Object} - Logo images
      - logo_256: Entire url to image 256x256px
      - logo_1024: Entire url to image 1024x1024px
      - logo_svg: Entire url to image svg
   - location: {Object} - Organization location
      - name: Location in human readable format [City, State]
      - country: Country code [XX] in accordance to [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
      - latitude: Latitude in decimal degrees
      - longitude: Longitude in decimal degrees
    },
  - social: {Object} - NOT THE ENTIRE URL, only usernames on social networks, 
    - keybase: Username
    - telegram: Username or group
    - twitter: Username
    - github: Username
    - youtube: Channel address
    - facebook: Page/group address
    - hive: Username without @
    - reddit: Username
    - wechat: Username
- nodes: [Array]
    - location: Node location
        - name: Node location in human readable format [City, State]
        - country: Node country code [XX]
        - latitude: Node latitude in decimal degrees
        - longitude: Node longitude in decimal degrees
    - node_type: Type of service `producer/query/seed` or an array of choices `["query","seed"]`
        - producer: Node with signing key
        - query: Node that provides HTTP(S) APIs to the public
        - seed: Node that provides P2P access to the public
    - p2p_endpoint: EOSIO P2P endpoint `host:port`
    - api_endpoint: EOSIO HTTP endpoint `http://host:port`
    - ssl_endpoint: EOSIO HTTPS endpoint `https://host:port`
    - features: [Array]
        - features supported by the `api_endpoint` or `ssl_endpoint` on query nodes, refer to the [list of features](https://github.com/eosrio/bp-info-standard#api-features)

### How to use it if you are Block Producer Candidate 
Create a file named `bp.json` in the root of your domain. For instance `http://yourwebsite.com/bp.json` When you register your producer using the `system.regproducer` action, the url field should be filled with `http://yourwebsite.com`. **Do not put the bp.json file in the url.**

### Overriding data for specific chains

The recommended way to specify multiple bp.json files under the same domain is to use the a `chains.json` file pointing to each `<chain>.json` file according to the chain_id, for example:

```json
{
  "chains": {
    "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906": "/bp.json",
    "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4": "/wax.json",
    "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11": "/telos.json",
    "21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c": "/fio.json",
    "d5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86": "/bos.json",
    "0000000000000000000000000000000000000000000000000000000000000123": "/other_chain.json"
  }
}
```

You can also override properties of the base `bp.json` file by creating a chain specific json file next to your base.

```
--/
----index.html
----chains.json
----bp.json
----chainA.json
----chainB.json
----bp.${chain_id}.json
----bp.aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906.json
```

The `bp.json` and `bp.${chain_id}.json` will be merged and any property inside of the chain specific json file will override the base properties.

### API Features
For query type nodes one or more features from the list below must be added:
  - `chain-api`: basic eosio::chain_api_plugin (/v1/chain/*)
  - `account-query`: (/v1/chain/get_accounts_by_authorizers)
  - `history-v1`: (/v1/history/*)
  - `hyperion-v2`: (/v2/*)
  - `dfuse`
  - `fio-api`
  - `snapshot-api`
  - `dsp-api`

### Useful Links
One can check for data validity using: https://www.jsonschemavalidator.net/
