import { Button, styled } from 'frostbyte';
import Spinner from './Spinner';
import { CheckCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';

const StyledCheckCircledIcon = styled(CheckCircledIcon, {
  color: '$purple12',
  width: '24px',
  height: '24px',
  marginRight: '10px',
});

const StyledAddIcon = styled(PlusCircledIcon, {
  color: '$purple12',
  width: '24px',
  height: '24px',
  marginRight: '10px',
});

const StyledButtonContent = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  placeItems: 'center',
});
export const TranscribeUploadsBtn = ({
  isChecked,
  isProcessing,
  setChecked,
}: {
  isChecked: boolean;
  isProcessing: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  if (isProcessing) {
    return <Spinner />;
  }

  if (isChecked) {
    return (
      <Button kind="success" size="sm" onClick={setChecked}>
        <StyledButtonContent>
          <StyledCheckCircledIcon /> <span>Selected</span>
        </StyledButtonContent>
      </Button>
    );
  }

  return (
    <Button kind="info" size="sm" onClick={setChecked}>
      <StyledButtonContent>
        <StyledAddIcon /> <span>Select</span>
      </StyledButtonContent>
    </Button>
  );
};
