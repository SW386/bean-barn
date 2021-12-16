import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography'

import { Order, HeadCell } from '../../Utils/SellerUtility'

interface enhancedTableHeadProps {
    headCells: HeadCell[],
    onRequestSort: (property: string) => void,
    order: Order,
    orderBy: string
}

function enhancedTableHead({ headCells, onRequestSort, order, orderBy }: enhancedTableHeadProps) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                    >
                        <div style={{display:"flex", flexDirection:"row"}}>
                            <Typography sx={{ fontWeight: 'bold' }}>{headCell.label}</Typography>
                            {headCell.ordered?
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={(orderBy === headCell.id)? order : 'asc'}
                                onClick={(event: React.MouseEvent<unknown>) => onRequestSort(headCell.id)}
                            /> : null}
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default enhancedTableHead;