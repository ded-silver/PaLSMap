import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { CustomNode, NodeData, NodeHeandlers } from '../../../types/nodeTypes';
import { nanoid } from 'nanoid';

export const TableNode = ({ data }: NodeProps<CustomNode>) => {
  const maxColumns = Math.max(
    data.tableName.length,
    ...data.tableData.map((row) => Object.keys(row).length),
  );

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {data.tableName.map((name, index) => (
                <TableCell key={nanoid()}>{name}</TableCell>
              ))}
              {data.tableName.length < maxColumns && (
                <TableCell key={nanoid()} colSpan={maxColumns - data.tableName.length}></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.tableData.map((row) => {
              const rowEntries = Object.entries(row);

              return (
                <TableRow key={nanoid()} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {rowEntries.map(([key, value]) => (
                    <TableCell key={nanoid()}>{value}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {data.handlers.map((h) => (
        <Handle
          key={nanoid()}
          type={h.type}
          id={h.id}
          position={h.type === 'source' ? Position.Right : Position.Left}
        />
      ))}
    </div>
  );
};
