/* *********===================== Setup store ======================********* */
import { AtrcStore, AtrcApis, AtrcRegisterStore } from 'atrc/build/data';

AtrcApis.baseUrl({
	key: 'atrc-global-api-base-url',
	// eslint-disable-next-line no-undef
	url: acmeFixImagesLocalize.rest_url,
});

/* Settings */
AtrcApis.register({
	key: 'settings',
	path: 'acme-fix-images/v1/settings',
	type: 'settings',
	filterResult: (data) => {
		const { response = {}, result } = data;
		if (
			response.headers &&
			response.headers.get('X-WP-Total') &&
			response.headers.get('X-WP-TotalPages')
		) {
			let data = { items: result.settings };
			data.countAllItems = parseInt(response.headers.get('X-WP-Total'));
			data.totalPages = parseInt(response.headers.get('X-WP-TotalPages'));
			return data;
		}
		return result;
	},
});

/* Settings Local for user preferance */
AtrcStore.register({
	key: 'acmeFixImagesLocal',
	type: 'localStorage',
});

// Add nonce
// eslint-disable-next-line no-undef
AtrcApis.xWpNonce(acmeFixImagesLocalize.nonce);
window.atrcStore = AtrcRegisterStore(acmeFixImagesLocalize.store);

import './admin/routes';
