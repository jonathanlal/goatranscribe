import { Th, Thead } from 'react-super-responsive-table';
import { Cell, HeaderRow, TBody, TRow, Table } from 'styles/table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { ReactNode } from 'react';

type Item = string | ReactNode;

const THeader = ({ items }: { items: Item[] }) => {
  return (
    <Thead>
      <HeaderRow>
        {items.map((item, index) => (
          <Th key={`th_${index}`}>{item}</Th>
        ))}
      </HeaderRow>
    </Thead>
  );
};

const Row = ({
  items,
  entry_id,
  onClick,
}: {
  items: Item[];
  entry_id: string;
  onClick?: (entry_id: string) => void;
}) => {
  return (
    <TRow
      onClick={onClick ? () => onClick(entry_id) : () => {}}
      hasLink={onClick ? true : false}
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
}: {
  headerItems: Item[];
  items: { entry_id: string; data: Item[] }[];
  onClick?: (entry_id: string) => void;
}) => {
  return (
    <Table>
      <THeader items={headerItems} />
      <TBody>
        {items.map(({ entry_id, data }) => (
          <Row
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
