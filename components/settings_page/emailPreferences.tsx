import { Button, CheckBox, H, P, Seperator, styled } from 'frostbyte';
import { useState } from 'react';
import { StyledItem, StyledSelect, TitleWithIconWrapper } from 'styles/shared';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useUpdateEmailPreferencesMutation } from 'store/services/settings';
import { Settings } from 'interfaces/Settings';
import { EmailTypes } from 'interfaces/EmailTypes';

export const EmailPreferences = ({ ssSettings }: { ssSettings: Settings }) => {
  const [marketing, setMarketing] = useState<boolean>(
    ssSettings.email_promotional
  );
  const [updateEmailPrefs] = useUpdateEmailPreferencesMutation();

  const [completedTranscripts, setCompletedTranscripts] = useState<boolean>(
    ssSettings.email_transcripts
  );

  const onCheck = async (emailType: EmailTypes) => {
    if (emailType === 'email_promotional') {
      setMarketing(!marketing);
    } else {
      setCompletedTranscripts(!completedTranscripts);
    }
    await updateEmailPrefs({
      emailType,
      isChecked:
        emailType === 'email_promotional' ? !marketing : !completedTranscripts,
    });
  };

  return (
    <>
      <TitleWithIconWrapper>
        <EnvelopeClosedIcon width={30} height={30} />{' '}
        <H color="purple9">Email Preferences</H>
      </TitleWithIconWrapper>

      <P
        size="20"
        color="purple8"
        css={{
          marginBottom: '20px',
        }}
      >
        Toggle the emails you want to receive.
      </P>

      <CheckBox
        checked={marketing}
        setChecked={() => onCheck('email_promotional')}
        label="Promotional emails"
        labelFor="marketing"
        labelColor="purple9"
      />
      <br />
      <br />
      <CheckBox
        checked={completedTranscripts}
        setChecked={() => onCheck('email_transcripts')}
        label="Completed transcriptions"
        labelFor="marketing"
        labelColor="purple9"
      />

      <Seperator color="purple8" css={{ margin: '20px auto' }} />
    </>
  );
};
