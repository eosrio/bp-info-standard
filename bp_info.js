const bp_info = {
	candidate_name: String,
	is_producer: Boolean,
	producer_account_name: String,
	producer_public_key: string,
	org_location: String,
	org_country_code: String,
	p2p_endpoint: String,
	api_endpoint: String,
	ssl_endpoint: String, //optional
	node_location: [{
		place: String
		latitude: Number,
		longitude: Number
	}],
	website: String,
	social: {
		steemit: String, //optional
		twitter: String, //optional
		youtube: String, //optional
		facebook: String, //optional
		reddit: String, //optional
		keybase: String, //optional
		telegram: String //optional
	}
}
