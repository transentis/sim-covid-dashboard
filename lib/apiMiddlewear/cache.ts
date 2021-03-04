class BasicJSCache {
	cache: Object
	constructor() {
		this.cache = {}
	}

	get(args, callBack: Function) {
		if (this.cache[args.key]) {
			if (Date.now() > this.cache[args.key].expires) {
				delete this.cache[args.key]
				return callBack('Expired cache key', null)
			} else {
				return callBack(null, this.cache[args.key].value)
			}
		}
		return callBack("Cache Key doesn't exist", null)
	}

	set(args, value: string | number | boolean | Object) {
		this.cache[args.key] = {
			expires: args.ttl ? this.setExp(Date.now(), args.ttl) : null,
			value: value,
		}
	}

	setExp(date: number, ms: number) {
		return date + ms
	}

	flushCache(callBack: Function) {
		this.cache = {}
		callBack(null, 'OK')
	}
}

export default BasicJSCache
