import React from 'react';
import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';

import NavbarComponent from '../Components/NavbarComponent';
import protectedRoute from '../Utils/ProtectedRoute';
import instance from '../Utils/Axios';

interface OrderInfo {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    status: string;
    lastUpdate: string;
}

const DetailedOrderPage:React.VFC = () => {
    const [rows, setRows] = React.useState<OrderInfo[]>([])
    const [orderId, setOrderId] = React.useState<number>(0)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const history = useHistory();

    useEffect(() => {
        setOrderId(history.location.pathname.split('/')[2])
        instance.post("/api/get_detailed_order", { order_id : orderId }).then(res => {
            const rawOrders = res.data as OrderInfo[]
            const orders = rawOrders.map(val => {
                return {
                    productId: val.productId,
                    name: val.name,
                    quantity: val.quantity,
                    price: val.price,
                    totalPrice: val.price * val.quantity,
                    status: val.status.charAt(0).toUpperCase() + val.status.slice(1),
                    lastUpdate: new Date(val.lastUpdate).toLocaleString()
                }
            })

            orders.sort()
            orders.reverse()
            setRows(orders)
        })
    }, [orderId])

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    };

    const handleChangePage = (event, newPage: number) => {
        setPage(newPage)
    }

    return (
        <div>
            <NavbarComponent/>
            <div style={{width: '70%', margin: 'auto'}}>
                <br />
                <br />
                <br />
                <h1>Order Details</h1>
                <h3>&nbsp;Order ID: {orderId}</h3>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>TotalPrice</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((row: OrderInfo) => (
                                <TableRow>
                                    <TableCell>
                                        <Link style={{textDecoration: 'none', color: 'black'}} to={`/EachPage/${row.productId}`}>
                                            {row.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>${row.price.toFixed(2)}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                    <TableCell>${row.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.lastUpdate}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell><b>Total</b></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>${rows.map(r => r.totalPrice).reduce((a, b) => { return a + b }, 0).toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                rowsPerPage={rowsPerPage}
                                colSpan={3}
                                page={page}
                                count={rows.length}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default protectedRoute(DetailedOrderPage)