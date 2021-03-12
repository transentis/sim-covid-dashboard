import { RequestBody } from './types.constants'
import { AxiosInstance } from 'axios'
import { ISetupCache, setup } from 'axios-cache-adapter'

class BptkAPI {
	api: AxiosInstance
	cache: ISetupCache
	apiKey: string

	/**
	 * @param  {string} apiKey - This is your API Key to authenticate with the BPTK Servers
	 */
	constructor(apiKey: string) {
		this.apiKey = apiKey

		this.api = setup({
			baseURL: 'http://api.transentis.com/bptk/transentis/covid-sim',

			cache: {
				maxAge: 15 * 60 * 1000,
				exclude: {
					methods: ['put', 'patch', 'delete'],
				},
			},
		})
	}

	/**
	 * @param  {RequestBody|string} requestBody - This is your Model you want to run on the server
	 * @returns This is the raw result from running your model
	 */
	requestModel = async (requestBody: RequestBody | string): Promise<any> => {
		try {
			const response = await this.api.post(
				`http://api.transentis.com/bptk/transentis/covid-sim/run/`,
				requestBody
			)
			console.log(response.request.fromCache)
			return response.data
		} catch (error) {
			console.error(error)
		}
	}

	/**
	 * @summary This helper functions converts raw model data into usable data for graphing libraries
	 * @param  data - This is your raw data returned from the BPTK Server to use further in other ways
	 * @returns Retruns the Chartified data for the specific inputted data
	 */
	chartifyData = (data: any) => {
		const temp = {}
		for (const attributes in data) {
			temp[attributes] = Object.values(data[attributes]).map(
				(value: number, index: number) => {
					return { x: index, y: value }
				}
			)
		}
		return temp
	}
}

export default BptkAPI
