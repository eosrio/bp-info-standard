# EOS BP Information Standard
JSON Standard for Block Producer Information on the EOS Blockchain

This is a proposed standard for Block Producer candidates to publish as the URL field of the `regproducer` action on the `eosio.system` contract.

- candidate_name: Organization name
- is_blockproducer: True or false
- producer_name: Name of producer account
- org_location: Human-readable organization location
- org_country_code: Organization country code
- p2p_endpoint: Main P2P Endpoint (host:port)
- api_endpoint: Main HTTP API Endpoint (http://hostname:port)
- ssl_endpoint: HTTPS API Endpoint (https://hostname:port)
- node_location: [Array]
  - place: Human-readable node location
  - latitude: Node latitude in decimal degrees (DD)
  - longitude: Node longitude in decimal degrees (DD)
- website: Block producer website
- social: {Object} - links to social networks
