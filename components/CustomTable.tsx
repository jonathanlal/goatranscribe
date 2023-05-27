import { Th, Thead } from 'react-super-responsive-table';
import { Cell, HeaderRow, TBody, TRow, Table } from 'styles/table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { ReactNode } from 'react';

type Item = string | ReactNode;

export const THeader = ({
  items,
  color = 'purple',
}: {
  items: Item[];
  color?: string;
}) => {
  return (
    <Thead>
      <HeaderRow color={color}>
        {items.map((item, index) => (
          <Th key={`th_${index}`}>{item}</Th>
        ))}
      </HeaderRow>
    </Thead>
  );
};

export const Row = ({
  items,
  entry_id,
  onClick,
  color = 'purple',
  disabled = false,
}: {
  items: Item[];
  entry_id: string;
  onClick?: (entry_id: string) => void;
  color?: string;
  disabled?: boolean;
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(entry_id);
    }
  };

  return (
    <TRow
      onClick={handleClick}
      hasLink={!disabled && onClick ? true : false}
      color={color}
      css={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {items.map((item, index) => (
        <Cell key={index}>{item}</Cell>
      ))}
    </TRow>
  );
};

export const CustomTable = ({
  headerItems,
  items,
  onClick,
  color = 'purple',
}: {
  headerItems: Item[];
  items: { entry_id?: string; data: Item[]; disabled?: boolean }[];
  onClick?: (entry_id: string) => void;
  color?: string;
}) => {
  return (
    <Table color={color}>
      <THeader items={headerItems} color={color} />
      <TBody>
        {items.map(({ entry_id, data, disabled }) => (
          <Row
            disabled={disabled}
            color={color}
            key={entry_id}
            entry_id={entry_id}
            items={data}
            onClick={onClick}
          />
        ))}
      </TBody>
    </Table>
  );
};
