/* WordPress */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/* Library */
import classNames from 'classnames';

import { map, cloneDeep, isEmpty } from 'lodash';

/*Atrc*/
import {
	AtrcText,
	AtrcControlSelect,
	AtrcControlToggle,
	AtrcWireFrameContentSidebar,
	AtrcWireFrameHeaderContentFooter,
	AtrcPrefix,
	AtrcPanelBody,
	AtrcPanelRow,
	AtrcContent,
	AtrcTitleTemplate2,
	AtrcButtonSaveTemplate1,
	AtrcControlSelectPostType,
	AtrcNotice,
	AtrcProgress,
	AtrcWrap,
	AtrcHr,
} from 'atrc';

/* Inbuilt */
import { AtrcReduxContextData } from './routes';

/*Local*/
const MainContent = () => {
	const data = useContext(AtrcReduxContextData);

	const { dbSettings, dbUpdateSetting } = data;

	const { imgType, deleteOld, postTypes = [], resizeImg = [] } = dbSettings;

	const updateSettingKey = (key, val) => {
		dbUpdateSetting(key, val);
	};

	return (
		<AtrcContent>
			<AtrcPanelRow>
				<AtrcControlToggle
					label={__('Delete all old images sizes ', 'acme-fix-images')}
					checked={deleteOld}
					onChange={() => updateSettingKey('deleteOld', !deleteOld)}
				/>
			</AtrcPanelRow>
			<AtrcHr className={classNames('at-m')} />
			<AtrcText
				tag='h6'
				className={classNames('at-m')}>
				{__('Regenerate options:', 'acme-fix-images')}
			</AtrcText>
			<AtrcPanelRow>
				<AtrcControlSelect
					label={__('Select images', 'acme-fix-images')}
					wrapProps={{
						className: 'at-flx-grw-1',
					}}
					value={imgType}
					options={[
						{
							value: 'all',
							label: __('All', 'acme-fix-images'),
						},
						{
							value: 'featured',
							label: __('Featured image only', 'acme-fix-images'),
						},
					]}
					onChange={(newVal) => updateSettingKey('imgType', newVal)}
				/>
			</AtrcPanelRow>

			{'featured' === imgType ? (
				<AtrcPanelRow>
					<AtrcControlSelectPostType
						label={__('Select post types', 'acme-fix-images')}
						wrapProps={{
							className: 'at-flx-grw-1',
						}}
						value={postTypes}
						isMulti={true}
						multiValType='array'
						onChange={(newVal) => updateSettingKey('postTypes', newVal)}
					/>
				</AtrcPanelRow>
			) : null}

			{acmeFixImagesLocalize.img_sizes ? (
				<>
					<AtrcPanelBody
						title={__('Image sizes and crop', 'acme-fix-images')}
						initialOpen={true}>
						{map(acmeFixImagesLocalize.img_sizes, (value, key) => (
							<AtrcPanelRow key={`afi-img-size-${key}`}>
								<AtrcControlToggle
									label={`${value.name} (${value.width}x${value.height})`}
									checked={resizeImg[key] && resizeImg[key].on}
									onChange={() => {
										const clonedActiveImgSizes = cloneDeep(resizeImg);
										if (!clonedActiveImgSizes[key]) {
											clonedActiveImgSizes[key] = {};
										}
										if (clonedActiveImgSizes[key].on) {
											clonedActiveImgSizes[key].on = false;
										} else {
											clonedActiveImgSizes[key].on = true;
										}
										updateSettingKey('resizeImg', clonedActiveImgSizes);
									}}
								/>
								{resizeImg[key] && resizeImg[key].on ? (
									<AtrcPanelRow>
										<AtrcControlToggle
											label={__('Cropped', 'acme-fix-images')}
											checked={resizeImg[key] && resizeImg[key].crop}
											onChange={() => {
												const clonedActiveImgSizes = cloneDeep(resizeImg);
												if (!clonedActiveImgSizes[key]) {
													clonedActiveImgSizes[key] = {};
												}
												if (clonedActiveImgSizes[key].crop) {
													clonedActiveImgSizes[key].crop = false;
												} else {
													clonedActiveImgSizes[key].crop = true;
												}
												updateSettingKey('resizeImg', clonedActiveImgSizes);
											}}
										/>
									</AtrcPanelRow>
								) : null}
							</AtrcPanelRow>
						))}
					</AtrcPanelBody>
				</>
			) : null}
		</AtrcContent>
	);
};

const Documentation = () => {
	const data = useContext(AtrcReduxContextData);

	const { lsSettings, lsSaveSettings } = data;

	return (
		<AtrcWireFrameHeaderContentFooter
			headerRowProps={{
				className: classNames(AtrcPrefix('header-docs'), 'at-m'),
			}}
			renderHeader={
				<AtrcTitleTemplate2
					title={__('Documentation', 'acme-fix-images')}
					buttons={[
						{
							iconProps: {
								type: 'svg',
								svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="at-svg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>',
							},
							onClick: () => {
								const localStorageClone = cloneDeep(lsSettings);
								localStorageClone.fiDocs1 = !localStorageClone.fiDocs1;
								lsSaveSettings(localStorageClone);
							},
							variant: 'danger',
							className: 'at-btn-close at-flx at-al-itm-ctr',
						},
					]}
				/>
			}
			renderContent={
				<>
					<AtrcPanelBody
						className={classNames(AtrcPrefix('m-0'))}
						title={__(
							'What is the Acme Fix Images WordPress Plugin?',
							'acme-fix-images'
						)}
						initialOpen={true}>
						<AtrcText
							tag='p'
							className={classNames(AtrcPrefix('m-0'), 'at-m')}>
							{__(
								'Acme Fix Images is a WordPress plugin designed to resolve issues related to thumbnail sizes for images uploaded to your Media Library. It allows you to regenerate all or selected thumbnail sizes for one or more images, ensuring they display correctly on your website.',
								'acme-fix-images'
							)}
						</AtrcText>
					</AtrcPanelBody>
					<AtrcPanelBody
						title={__(
							'Why would I need to regenerate thumbnails?',
							'acme-fix-images'
						)}
						initialOpen={false}>
						<AtrcText
							tag='p'
							className={classNames(AtrcPrefix('m-0'), 'at-m')}>
							{__(
								'There are several reasons why you might need to regenerate thumbnails. These include switching themes, encountering issues with images not displaying correctly due to improper thumbnail sizes, and fixing image sizes after you have changed image sizes from Media Settings. Regenerating thumbnails ensures consistency and proper display of images across your website.',
								'acme-fix-images'
							)}
						</AtrcText>
					</AtrcPanelBody>
					<AtrcPanelBody
						title={__(
							'Is Acme Fix Images compatible with my WordPress theme?',
							'acme-fix-images'
						)}
						initialOpen={false}>
						<AtrcText
							tag='p'
							className={classNames(AtrcPrefix('m-0'), 'at-m')}>
							{__(
								"Acme Fix Images is designed to work with most WordPress themes. However, compatibility can vary depending on the specific features and functionality of your theme. It's always a good idea to test the plugin on a staging site or back up your website before making any significant changes.",
								'acme-fix-images'
							)}
						</AtrcText>
					</AtrcPanelBody>
					<AtrcPanelBody
						title={__(
							'Does Acme Fix Images delete any media?',
							'acme-fix-images'
						)}
						initialOpen={false}>
						<AtrcText
							tag='p'
							className={classNames(AtrcPrefix('m-0'), 'at-m')}>
							{__(
								'No, it does not delete any media. The plugin solely focuses on regenerating thumbnail sizes and does not involve deleting any media files from your WordPress Media Library.',
								'acme-fix-images'
							)}
						</AtrcText>
					</AtrcPanelBody>
				</>
			}
			allowHeaderRow={false}
			allowHeaderCol={false}
			allowContentRow={false}
			allowContentCol={false}
		/>
	);
};

const Settings = () => {
	const data = useContext(AtrcReduxContextData);
	const {
		lsSettings,
		lsSaveSettings,
		dbIsLoading,
		dbSettings,
		fiNotices,
		fiProgress,
		fixImages,
		btnTxt,
		attachmentData,
		countProcess,
	} = data;

	if (!dbSettings) {
		return null;
	}

	const { fiDocs1 } = lsSettings;

	return (
		<AtrcWireFrameHeaderContentFooter
			wrapProps={{
				className: classNames(AtrcPrefix('bg-white'), 'at-bg-cl'),
			}}
			renderContent={
				fiProgress ? null : (
					<AtrcWireFrameContentSidebar
						wrapProps={{
							allowContainer: true,
							type: 'fluid',
							tag: 'section',
						}}
						renderContent={<MainContent />}
						renderSidebar={!fiDocs1 ? <Documentation /> : null}
						contentProps={{
							contentCol: fiDocs1 ? 'at-col-12' : 'at-col-7',
						}}
						sidebarProps={{
							sidebarCol: 'at-col-5',
						}}
					/>
				)
			}
			renderFooter={
				<>
					{fiProgress ? (
						<>
							{fiProgress !== 100 ? (
								<AtrcNotice
									isDismissible={false}
									status='info'>
									{__(
										'Please remain patient as the thumbnails are being regenerated. Updates will be provided below as each image is processed.',
										'acme-fix-images'
									)}
								</AtrcNotice>
							) : null}
						</>
					) : (
						<AtrcNotice
							isDismissible={false}
							status='info'>
							{__(
								'Be sure to backup your site before regenerate thumbnails.',
								'acme-fix-images'
							)}
						</AtrcNotice>
					)}
					{fiProgress !== 100 ? (
						<>
							<AtrcButtonSaveTemplate1
								isLoading={dbIsLoading}
								canSave={true}
								text={{
									save: btnTxt,
								}}
								disabled={dbIsLoading}
								onClick={() => fixImages(dbSettings)}
							/>
						</>
					) : null}

					{fiProgress ? (
						<>
							<AtrcText tag='h3'>
								{__('Process details:', 'acme-fix-images')}
							</AtrcText>
							<AtrcText tag='p'>
								{__('Total:', 'acme-fix-images') + attachmentData.countAllItems}
							</AtrcText>
							<AtrcText tag='p'>
								{__('Processed:', 'acme-fix-images') + countProcess}
							</AtrcText>
							<AtrcProgress
								style={{
									'--at-bar-w': fiProgress + '%',
								}}>
								{parseInt(fiProgress) + '%'}
							</AtrcProgress>
						</>
					) : null}

					{/*Notice is common for settings*/}
					{!isEmpty(fiNotices)
						? map(fiNotices, (value, key) => (
								<AtrcNotice isDismissible={false}>
									<AtrcText tag='h5'>{value.main}</AtrcText>

									{value.createdLog ? (
										<AtrcWrap
											dangerouslySetInnerHTML={{
												__html: value.createdLog.join('<br />'),
											}}
										/>
									) : null}
									{value.deletedLog ? (
										<AtrcWrap
											dangerouslySetInnerHTML={{
												__html: value.deletedLog.join('<br />'),
											}}
										/>
									) : null}
								</AtrcNotice>
						  ))
						: null}
				</>
			}
			allowHeaderRow={false}
			allowHeaderCol={false}
			allowContentRow={false}
			allowContentCol={false}
		/>
	);
};

export default Settings;
