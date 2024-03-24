/* WordPress */
import { __ } from '@wordpress/i18n';

import { useContext } from '@wordpress/element';

/* Library */
import classNames from 'classnames';

/*Atrc*/
import { AtrcButton, AtrcWrap, AtrcHeaderTemplate1 } from 'atrc';

/* Inbuilt */
import { AtrcReduxContextData } from '../../routes';

/*Local*/
const AdminHeader = () => {
	const data = useContext(AtrcReduxContextData);

	const { lsSettings, lsSaveSettings } = data;
	return (
		<AtrcHeaderTemplate1
			isSticky
			logo={{
				src: acmeFixImagesLocalize.white_label.dashboard.logo,
			}}
			title={{
				children: __('Acme fix images', 'acme-coming-soon'),
			}}
			floatingSidebar={() => (
				<AtrcWrap className={classNames()}>
					<AtrcButton
						className={classNames()}
						onClick={() => lsSaveSettings(null)}>
						{__(
							'Show all hidden informations, notices and documentations ',
							'acme-coming-soon'
						)}
					</AtrcButton>
				</AtrcWrap>
			)}
		/>
	);
};

export default AdminHeader;
