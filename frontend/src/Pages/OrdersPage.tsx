import React from 'react';
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Button } from '@material-ui/core';

import NavbarComponent from '../Components/NavbarComponent';
import protectedRoute from '../Utils/ProtectedRoute';
import instance from '../Utils/Axios';

interface OrderInfo {
    id: number;
    date: number;
    num_unfufilled: number;
}

const OrdersPage:React.VFC = () => {
    const [rows, setRows] = React.useState<OrderInfo[]>([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const history = useHistory();

    useEffect(() => {
        instance.get("/api/get_orders").then(res => {
            const rawOrders: any[] = res.data as any[]
            const orders = rawOrders.map(val => {
                return {date: Date.parse(val.time_purchased), id: val.id, num_unfufilled: val.num_unfufilled}
            })
            console.log(orders)
            orders.sort()
            orders.reverse()
            setRows(orders)
        })
    }, [])

    const handleDetailedOrder = (event) => {
        const id = event.currentTarget.value
        history.push(`/detailed_user_order/${id}`)
    }

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
                <h1>Orders</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Date Ordered</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((row: OrderInfo, i) => (
                                <TableRow>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                                    <TableCell>{row.num_unfufilled == 0 ? 'Fulfilled' : 'Pending'}</TableCell>
                                    <TableCell align='right' style={{width: '15%'}}>
                                        <Button
                                            variant='outlined'
                                            onClick={handleDetailedOrder}
                                            value={row.id}
                                        >
                                            details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
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

export default protectedRoute(OrdersPage)