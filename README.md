# EOS BP Information Standard
**JSON Standard for Block Producer Information on the EOS Blockchain**

This is a proposed standard for Block Producer candidates to publish as the URL field of the `regproducer` action on the `eosio.system` contract.

The current revision is compliant with the JSON schema Draft v7 - http://json-schema.org/specification.html

- producer_account_name: Name of producer account
- producer_public_key: Public key for producer account
- org: [Object]
  - candidate_name: Producer/organization name
  - website: Block producer website
  - code_of_conduct: Full link to where it is,
  - email: Contact email
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
    - steemit: Username without @
    - steemit: Username
    - twitter: Username
    - youtube: Channel address
    - facebook: Page/group address
    - github: Username
    - reddit: Username
    - keybase: Username
    - telegram: Username
    - wechat: Username
- nodes: [Array]
    - location: Node location
        - name: Node location in human readable format [City, State]
        - country: Node country code [XX]
        - latitude: Node latitude in decimal degrees
        - longitude: Node longitude in decimal degrees
    - is_producer: Is this node a producer? `true/false`
    - p2p_endpoint: EOSIO P2P endpoint `host:port`
    - bnet_endpoint: EOSIO BNET endpoint `host:port`
    - api_endpoint: EOSIO HTTP endpoint `http://host:port`
    - ssl_endpoint: EOSIO HTTPS endpoint `https://host:port`

### How to use it if you are Block Producer Candidate 
Create a file named `bp.json` in the root of your domain. For instance `http://yourwebsite.com/bp.json` When you register your producer using the `system.regproducer` action, the url field should be filled with `http://yourwebsite.com`. **Do not put the bp.json file in the url.**

### Overriding jsons for specific chains

You can override properties of the base `bp.json` file by creating a chain specific json file next to your base.

```
--/
----index.html
----bp.json
----bp.${chain_id}.json
----bp.2018052300203000000000000000000000000000000000007472696e6974790a.json
```

The `bp.json` and `bp.${chain_id}.json` will be merged and any property inside of the chain specific json file will override the base properties.

### Useful Links
One can check for data validity using: https://www.jsonschemavalidator.net/
