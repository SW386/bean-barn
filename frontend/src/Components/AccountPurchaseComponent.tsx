import React, {useEffect, useState} from 'react';
import instance from "../Utils/Axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import Container from "@mui/material/Container";

interface orderAndPurchase {
    order : {
        id : number,
        time_purchased : string,
        buyer_id : number,
    }, 
    purchase : {
        product_id : number,
        order_id : number,
        quantity : number,
        price_per_item : number,
        fulfillment_status : string
    },
    product : {
        id : number, 
        seller_id :  number, 
        quantity : number,
        name : string,
        price : number,
        description : string,
        img_link : string, 
        category : string,
        available : boolean
    }
}

const AccountPurchaseComponent : React.VFC = () => {

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [orderAndPurchases, setOrderAndPurchases] = useState<orderAndPurchase[]>([])

    useEffect(()=> {
        instance.get('/api/purchase').then(res => {
            const data = Object.assign({}, res.data)
            if ("purchases" in data) {
                setOrderAndPurchases(data["purchases"])
            }
        })
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return(<Container>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="Past Purchases">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Fulfillment</TableCell>
                        <TableCell>Date Purchased</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderAndPurchases.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((p) => (
                        <TableRow>
                            <TableCell>{p.product.name}</TableCell>
                            <TableCell>{p.purchase.quantity}</TableCell>
                            <TableCell>{p.purchase.price_per_item}</TableCell>
                            <TableCell>{p.purchase.fulfillment_status}</TableCell>
                            <TableCell>{p.order.time_purchased}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={3}
                            count={orderAndPurchases.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                                }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </Container>)
}

export default AccountPurchaseComponent;