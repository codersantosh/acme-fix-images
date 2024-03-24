/*CSS*/
import './admin.scss';

/* WordPress */
import { render, createContext, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/* Library */
import { pickBy, cloneDeep, isEmpty } from 'lodash';

/*Atrc*/
import { AtrcHashRouter, AtrcWrap, AtrcMain } from 'atrc';

import { AtrcApis, AtrcApplyWithSettings } from 'atrc/build/data';

/*Inbuilt*/
import AFI_Fix_Images from './fix-images';
import { AdminHeader } from './components/organisms';

/* Local */
/* ==============Create Local Storage and Database Settings Context================== */
export const AtrcReduxContextData = createContext();

/* Admin routes pages */
const AdminRoutes = () => {
	return (
		<>
			<AdminHeader />
			<AtrcMain>
				<AFI_Fix_Images />
			</AtrcMain>
		</>
	);
};

/* Initilize database settings and add Context data*/
let AcmeFixImagesAttachmentData = {};
let AcmeFixImagesCountProcess = 0;
let AcmeFixImagesPausedProcess = false;
const InitDatabaseSettings = (props) => {
	const {
		isLoading,
		canSave,
		settings,
		updateSetting,
		lsSettings,
		lsUpdateSetting,
		lsSaveSettings,
	} = props;

	const [notices, setNotices] = useState([]);
	const [progress, setProgress] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const getBtnTxt = () => {
		if (isPaused) {
			return __('Resume regenerate', 'acme-fix-images');
		}
		if (progress) {
			return __('Pause process', 'acme-fix-images');
		}
		return __('Regenerate thumbnails', 'acme-fix-images');
	};

	const getImagesData = async ({ settings, paged = 1 }) => {
		const clonedFetchedData = cloneDeep(settings);
		clonedFetchedData.paged = paged;

		const getImages = await AtrcApis.doApi({
			key: 'settings',
			type: 'saveSettings',
			data: clonedFetchedData,
		});

		return getImages;
	};

	const doRegen = async (props = {}) => {
		let paged = 1;

		if (props.paged) {
			paged = props.paged;
		}
		const clonedFetchedData = cloneDeep(settings);
		const activeImage = pickBy(clonedFetchedData.resizeImg, (item) => item.on);

		const regenData = {
			action: 'regen',
			resizeImg: activeImage,
			thumbnails: Object.keys(activeImage),
			deleteOld: clonedFetchedData.deleteOld,
		};

		for (const item of AcmeFixImagesAttachmentData.items) {
			if (AcmeFixImagesPausedProcess) {
				const remainingItems = AcmeFixImagesAttachmentData.items.slice(
					AcmeFixImagesCountProcess
				);
				AcmeFixImagesAttachmentData = {
					...AcmeFixImagesAttachmentData,
					items: remainingItems,
				};

				break;
			}

			regenData.id = item;

			try {
				const getRegen = await AtrcApis.doApi({
					key: 'settings',
					type: 'saveSettings',
					data: regenData,
				});

				const { deleted_log, attachment, created_log } = getRegen.settings;

				const message = {};
				if (deleted_log && !isEmpty(deleted_log)) {
					message.deletedLog = deleted_log;
				}
				if (created_log && !isEmpty(created_log)) {
					message.createdLog = created_log;
				}

				if (attachment && attachment.ID) {
					message.main = sprintf(
						'Image "%s" (ID: %d) regen log: ',
						attachment.post_title,
						attachment.ID
					);
				}

				setNotices((prevNotices) => [...prevNotices, message]);
				AcmeFixImagesCountProcess++;
				const process =
					(AcmeFixImagesCountProcess /
						AcmeFixImagesAttachmentData.countAllItems) *
					100;
				setProgress(process);
			} catch (error) {
				console.error(
					__('Error occurred while regenerating image:', 'acme-fix-images'),
					error
				);
			}
		}
		if (!AcmeFixImagesPausedProcess) {
			const newPage = paged + 1;

			if (newPage <= AcmeFixImagesAttachmentData.totalPages) {
				const newGetImages = await getImagesData({
					settings,
					paged: newPage,
				});
				AcmeFixImagesAttachmentData = newGetImages;
				doRegen({ paged: newPage });
			}
		}
	};

	const dbProps = {
		lsSettings: lsSettings,
		lsUpdateSetting: lsUpdateSetting,
		lsSaveSettings: lsSaveSettings,
		dbIsLoading: isLoading,
		dbCanSave: canSave,
		dbSettings: settings,
		dbUpdateSetting: updateSetting,
		fiProgress: progress,
		fiNotices: notices,
		fixImages: async () => {
			if (AcmeFixImagesCountProcess) {
				AcmeFixImagesPausedProcess = !AcmeFixImagesPausedProcess;
				setIsPaused(AcmeFixImagesPausedProcess);
				if (!AcmeFixImagesPausedProcess) {
					doRegen();
				}
			} else {
				const getImages = await getImagesData({
					settings,
				});

				if (
					getImages &&
					getImages.countAllItems &&
					getImages.totalPages &&
					getImages.items
				) {
					AcmeFixImagesAttachmentData = getImages;
					doRegen();
				}
			}
		},
		btnTxt: getBtnTxt(),
		attachmentData: AcmeFixImagesAttachmentData,
		countProcess: AcmeFixImagesCountProcess,
	};
	return (
		<AtrcReduxContextData.Provider value={{ ...dbProps }}>
			<AtrcHashRouter basename='/'>
				<AtrcWrap
					variant='wrp'
					className='at-box-szg at-m at-typ'>
					<AdminRoutes />
				</AtrcWrap>
			</AtrcHashRouter>
		</AtrcReduxContextData.Provider>
	);
};
const InitDataBaseSettingsWithHoc = AtrcApplyWithSettings(InitDatabaseSettings);

/* Initilize local storage */
const InitLocalStorageSettings = (props) => {
	const { settings, updateSetting, saveSettings } = props;
	const defaultSettings = {
		fiDocs1: false /* fix image 1 */,
	};
	return (
		<InitDataBaseSettingsWithHoc
			atrcStore='acme-fix-images'
			atrcStoreKey='settings'
			lsSettings={settings || defaultSettings}
			lsUpdateSetting={updateSetting}
			lsSaveSettings={saveSettings}
		/>
	);
};
const InitLocalStorageSettingsWithHoc = AtrcApplyWithSettings(
	InitLocalStorageSettings
);

/* Initilize react on oru div */
document.addEventListener('DOMContentLoaded', () => {
	// Check if the root element exists in the DOM
	const rootElement = document.getElementById(acmeFixImagesLocalize.root_id);

	if (rootElement) {
		// Render the component into the root element
		render(
			<InitLocalStorageSettingsWithHoc
				atrcStore='acme-fix-images'
				atrcStoreKey='acmeFixImagesLocal'
			/>,
			rootElement
		);
	}
});
