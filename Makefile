include secrets.mk

sign:
	web-ext --config=config.js sign --api-key=$(JWT_issuer) --api-secret=$(JWT_secret)
