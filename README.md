# EOS BP Information Standard
**JSON Standard for Block Producer Information on the EOS Blockchain**

This is a proposed standard for Block Producer candidates to publish as the URL field of the `regproducer` action on the `eosio.system` contract.

The current revision is compliant with the JSON schema Draft v7 - http://json-schema.org/specification.html

- producer_account_name: Name of producer account
- producer_public_key: Public key for producer account
- org: [Object]
  - location: Organization location
    - name: Location in human readable format [City, State]
    - country: Country code [XX]
    - latitude: Latitude in decimal degrees
    - longitude: Longitude in decimal degrees
  - candidate_name: Producer/organization name
  - website: Block producer website
  - social: {Object} - links to social networks
- nodes: [Array]
  - location: Node location
      - name: Node location in human readable format [City, State]
      - country: Node country code [XX]
      - latitude: Node latitude in decimal degrees
      - longitude: Node longitude in decimal degrees
  - is_producer: Is this node a producer? `true/false`
  - p2p_endpoint: EOSIO P2P endpoint `host:port`
  - api_endpoint: EOSIO HTTP endpoint `http://host:port`
  - ssl_endpoint: EOSIO HTTPS endpoint `https://host:port`

### Useful Links
One can check for data validity using: https://www.jsonschemavalidator.net/
