## This is just a placeholder to display our use of this schema.
[Click here to view the bp-info-standard repository](https://github.com/eosrio/bp-info-standard)
**Do not copy schema from this repository, it will not be updated when the origin is updated**

We are using `bp-info-standard` formatted JSON to collect optional extra meta-data about BPs.


### The base json file

**Create a file named `bp.json` in the root of your domain. For instance `http://yourwebsite.com/bp.json`**
When you register your producer the `url` field should be filled with `http://yourwebsite.com/`. Do not put the bp.json file in the `url`.

### Overriding jsons for specific chains

You can ovveride properties of the base `bp.json` file by creating a chain specific json file next to your base.

```
--/
----index.html
----bp.json
----bp.${chain_id}.json
----bp.2018052300203000000000000000000000000000000000007472696e6974790a.json
```

The `bp.json` and `bp.${chain_id}.json` will be merged and any property inside of the chain specific json file will override the base properties.
