import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Link } from "react-router-dom";

const PurchaseRowComponent = ({ 
    buyerName, 
    buyerEmail,
    buyerAddress, 
    productName, 
    quantity, 
    timePurchased, 
    fulfillment, 
    onFulfillmentChange 
}) => {
    return (
        <TableRow>
            <TableCell>
                <Link to={{pathname: `/public/${buyerEmail}`}}> 
                    {buyerName}
                </Link>
            </TableCell>
            <TableCell>
                {buyerAddress}
            </TableCell>
            <TableCell>
                {productName}
            </TableCell>
            <TableCell align="right">
                {quantity}
            </TableCell>
            <TableCell>
                {timePurchased}
            </TableCell>
            <TableCell>
                <Select value={fulfillment} 
                    disabled={fulfillment === "delivered"}
                    onChange={(e: SelectChangeEvent) => {onFulfillmentChange(e.target.value);}}
                >
                    <MenuItem value="ordered">Ordered</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
            </TableCell>
        </TableRow>
    );
};

export default PurchaseRowComponent;