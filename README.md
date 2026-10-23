# Antelope BP Information Standard

**JSON Standard for Block Producer Information on Antelope (former EOSIO) Blockchains**

This is a proposed standard for Block Producer candidates to publish as the URL field of the `regproducer` action on
the `eosio.system` contract.

The current revision **v1.2.0** keeps the [Zod](https://github.com/colinhacks/zod) validator and `schema.json` on the same required set. `schema.json` is JSON Schema [Draft 2019-09](https://json-schema.org/specification-links.html#2019-09-formerly-known-as-draft-8).

### Recent Changes

- **v1.2.0**:
  - `nodes[].full` is optional. Omit it when the publisher is not stating whether history starts at block 1. `true` means it does. `false` means history is trimmed.
  - `schema.json` now requires `p2p_endpoint` on a seed and `api_endpoint` or `ssl_endpoint` on a query, matching the Zod schema.
  - `org.website` is required in the Zod schema, matching `schema.json`.
  - This document names every required field.
- **v1.1.0**:
  - Added Zod-based schema validation alongside the existing JSON Schema
  - Published as npm package `@eosrio/bp-info-standard`
  - Added improved error handling with detailed validation messages
  - Enhanced TypeScript support with full type inference

### Required

Both schemas reject a document that omits an unconditional field below. The endpoint rules apply only to the node types named with them.

- `producer_account_name`: Producer account name.
- `org.candidate_name`: Producer or organization name.
- `org.website`: Block producer website. Full URL, with no trailing slash.
- `org.location.name`: Location in human-readable form, such as city and state.
- `org.location.country`: Country code `[XX]` in [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
- `nodes`: Array of service nodes. It may be empty.
- `nodes[].node_type`: `producer`, `query`, `seed`, or an array of those values, such as `["query","seed"]`.
  - `producer`: node with a signing key.
  - `query`: node that provides HTTP(S) APIs to the public.
  - `seed`: node that provides P2P access to the public.
- `nodes[].p2p_endpoint`: Required when `node_type` is `seed` or the array includes `seed`. Leap P2P endpoint, `host:port`.
- `nodes[].api_endpoint` or `nodes[].ssl_endpoint`: At least one is required when `node_type` is `query` or the array includes `query`. `api_endpoint` is `http://...`. `ssl_endpoint` is `https://...`.

### Optional

Every other field is optional. A present value still has to match the format in `schema.json`.

- `org.code_of_conduct`: Full URL to the page.
- `org.ownership_disclosure`: Full URL to the page.
- `org.email`: Contact email.
- `org.github_user`: Operational GitHub username, or an array of usernames.
- `org.chain_resources`: Website with chain-related resources such as snapshots and backups.
- `org.other_resources`: Array of other relevant URLs.
- `org.branding`: Logo images.
  - `logo_256`: URL of a 256x256 PNG.
  - `logo_1024`: URL of a 1024x1024 PNG.
  - `logo_svg`: URL of an SVG.
- `org.location.latitude` and `org.location.longitude`: Decimal degrees.
- `org.social`: Usernames only, not full URLs.
  - `keybase`, `telegram`, `twitter`, `github`, `reddit`, `wechat`, `hive` (no `@`), `medium`, `discord`
  - `youtube`: channel address
  - `facebook`: page or group address
- `nodes[].location`: Same shape as `org.location`. `name` and `country` are required only when `location` itself is present.
- `nodes[].full`: `true` when the data starts at block 1. `false` when history is trimmed. Omit the field when the publisher is not making that claim.
- `nodes[].p2p_endpoint`, `nodes[].api_endpoint`, `nodes[].ssl_endpoint`: Optional on node types that do not require them.
- `nodes[].features`: Features served by the query endpoint. See [API features](#api-features). The schema does not require this array.
- `nodes[].metadata`: Object keyed by a feature name.

### How to use it if you are Block Producer Candidate

Create a file named `bp.json` in the root of your domain. For instance `https://yourwebsite.com/bp.json` When you
register your producer using the `system.regproducer` action, the url field should be filled
with `https://yourwebsite.com`. **Do not put the bp.json file in the url.**

### Overriding data for specific chains

The recommended way to specify multiple bp.json files under the same domain is to use the a `chains.json` file pointing
to each `<chain>.json` file according to the chain_id, for example:

```json
{
  "chains": {
    "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906": "/bp.json",
    "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4": "/wax.json",
    "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11": "/telos.json",
    "21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c": "/fio.json",
    "38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465": "/libre.json",
    "0000000000000000000000000000000000000000000000000000000000000123": "/other_chain.json"
  }
}
```

It's posible to not include the slash on the sub-url value, as it is implied we are building an url.

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

The `bp.json` and `bp.${chain_id}.json` will be merged and any property inside of the chain specific json file will
override the base properties.

### API Features

A query node may list the features its endpoint serves. Each entry is one of:

- `chain-api`: basic eosio::chain_api_plugin (/v1/chain/*)
- `account-query`: (/v1/chain/get_accounts_by_authorizers)
- `history-v1`: (/v1/history/*)
- `hyperion-v2`: (/v2/*)
- `dfuse`
- `fio-api`
- `snapshot-api`
- `dsp-api`
- `atomic-assets-api`
- `light-api`
- `ipfs`
- `firehose`
- `substreams`

### Useful Links

One can check for data validity using: https://www.jsonschemavalidator.net/

## Using as a Library

This package can be used as a library to validate BP information in your JavaScript/TypeScript projects.

### Installation

```bash
npm install @eosrio/bp-info-standard
```

### Usage

#### Validating BP Information

```typescript
import { BPInfoSchema } from '@eosrio/bp-info-standard';

// Your BP information object
const bpInfo = {
  producer_account_name: 'producername',
  org: {
    candidate_name: 'My Organization',
    website: 'https://example.com',
    code_of_conduct: 'https://example.com/code',
    ownership_disclosure: 'https://example.com/ownership',
    email: 'contact@example.com',
    location: {
      name: 'New York, USA',
      country: 'US'
    },
    chain_resources: 'https://example.com/resources'
  },
  nodes: [
    {
      location: {
        name: 'New York, USA',
        country: 'US'
      },
      node_type: 'producer',
      full: true
    }
  ]
};

// Validate the BP information
const result = BPInfoSchema.safeParse(bpInfo);

if (result.success) {
  console.log('BP information is valid!');
  // Use the validated data
  const validatedData = result.data;
} else {
  console.log('BP information is invalid!');
  // Handle validation errors
  console.error(result.error);
}
```

#### Handling Validation Errors

```typescript
import { BPInfoSchema, handleZodError } from '@eosrio/bp-info-standard';

// Your BP information object
const bpInfo = { /* ... */ };

// Validate the BP information
const result = BPInfoSchema.safeParse(bpInfo);

if (!result.success) {
  // Format the validation errors
  const errorMessages = handleZodError(result.error, {
    logToConsole: true,
    originalObject: bpInfo
  });

  // Display the error messages
  errorMessages.forEach(message => console.log(message));
}
```

For more information about Zod schema validation, refer to the [Zod documentation](https://github.com/colinhacks/zod).
