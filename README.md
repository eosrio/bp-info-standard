# EOS BP Information Standard
JSON Standard for Block Producer Information on the EOS Blockchain

This is a proposed standard for Block Producer candidates to publish as the URL field of the `regproducer` action on the `eosio.system` contract.

- candidate_name: Organization name
- org_location: Human-readable organization location
- org_country_code: Organization country code
- node_location: [Array]
  - place: Human-readable node location
  - latitude: Node latitude in decimal degrees (DD)
  - longitude: Node longitude in decimal degrees (DD)
- website: Block producer website
- social: {Object} - links to social networks
