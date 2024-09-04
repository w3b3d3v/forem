import { h } from 'preact';
import moment from 'moment';
import PropTypes from 'prop-types';
import { locale } from '../../utilities/locale';
import { Options } from './Options';
import { ButtonNew as Button } from '@crayons';

export const EditorActions = ({
  onSaveDraft,
  onPublish,
  onClearChanges,
  published,
  publishedAtDate,
  publishedAtTime,
  schedulingEnabled,
  edited,
  version,
  passedData,
  onConfigChange,
  submitting,
  previewLoading,
  switchHelpContext,
}) => {
  const isVersion1 = version === 'v1';
  const isVersion2 = version === 'v2';

  if (submitting) {
    return (
      <div className="crayons-article-form__footer">
        <Button
          variant="primary"
          className="mr-2 whitespace-nowrap"
          onClick={onPublish}
          disabled
        >
          {published && isVersion2
            ? locale('views.editor.actions.publishing')
            : `${locale('views.editor.actions.saving')} ${
                isVersion2 ? locale('views.editor.actions.draft') : ''
              }...`}
        </Button>
      </div>
    );
  }

  const now = moment();
  const publishedAtObj = publishedAtDate
    ? moment(`${publishedAtDate} ${publishedAtTime || '00:00'}`)
    : now;
  const schedule = publishedAtObj > now;
  const wasScheduled = passedData.publishedAtWas > now;

  let saveButtonText;
  if (isVersion1) {
    saveButtonText = locale('views.editor.actions.save');
  } else if (schedule) {
    saveButtonText = locale('views.editor.actions.schedule');
  } else if (wasScheduled || !published) {
    // if the article was saved as scheduled, and the user clears publishedAt in the post options, the save button text is changed to "Publish"
    // to make it clear that the article is going to be published right away
    saveButtonText = locale('views.editor.actions.publish');
  } else {
    saveButtonText = locale('views.editor.actions.save');
  }

  return (
    <div
      id="editor-actions"
      className="crayons-article-form__footer"
      onMouseEnter={switchHelpContext}
    >
      <Button
        variant="primary"
        className="mr-2 whitespace-nowrap"
        onClick={onPublish}
        disabled={previewLoading}
        onFocus={(event) => switchHelpContext(event, 'editor-actions')}
      >
        {saveButtonText}
      </Button>

      {!(published || isVersion1) && (
        <Button
          className="mr-2 whitespace-nowrap"
          onClick={onSaveDraft}
          disabled={previewLoading}
          onFocus={(event) => switchHelpContext(event, 'editor-actions')}
        >
          {locale('views.editor.actions.save')}{' '}
          <span className="hidden s:inline">
            {locale('views.editor.actions.draft')}
          </span>
        </Button>
      )}

      {isVersion2 && (
        <Options
          passedData={passedData}
          schedulingEnabled={schedulingEnabled}
          onConfigChange={onConfigChange}
          onSaveDraft={onSaveDraft}
          previewLoading={previewLoading}
          onFocus={(event) => switchHelpContext(event, 'editor-actions')}
        />
      )}

      {edited && (
        <Button
          onClick={onClearChanges}
          className="whitespace-nowrap fw-normal fs-s"
          disabled={previewLoading}
          onFocus={(event) => switchHelpContext(event, 'editor-actions')}
        >
          {locale('views.editor.actions.revert')}{' '}
          <span className="hidden s:inline">
            {locale('views.editor.actions.changes')}
          </span>
        </Button>
      )}
    </div>
  );
};

EditorActions.propTypes = {
  onSaveDraft: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  published: PropTypes.bool.isRequired,
  publishedAtTime: PropTypes.string.isRequired,
  publishedAtDate: PropTypes.string.isRequired,
  schedulingEnabled: PropTypes.bool.isRequired,
  edited: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
  onClearChanges: PropTypes.func.isRequired,
  passedData: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  previewLoading: PropTypes.bool.isRequired,
};

EditorActions.displayName = 'EditorActions';
