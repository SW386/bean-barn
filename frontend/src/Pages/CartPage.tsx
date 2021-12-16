import React from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
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
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import NavbarComponent from '../Components/NavbarComponent';
import protectedRoute from '../Utils/ProtectedRoute';
import instance from '../Utils/Axios';
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ItemInfo {
    id: number,
    item: string,
    price: number,
    quantity: number,
    totalPrice: number
}

const createData = (id: number, item: string, price: number, quantity: number): ItemInfo => {
    return { id, item, price, quantity, totalPrice: price * quantity }
}

const CartPage:React.VFC = () => {
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [rows, setRows] = React.useState<ItemInfo[]>([])
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        updateCart()
    }, [])

    const updateCart = () => {
        instance.get('/api/get_cart').then(res => {
            const rawItems: any[] = res.data as any[]
            const items = rawItems.map(val => {
                return createData(val.id, val.name, val.price, val.quantity)
            })
            setRows(items)
        })
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    };

    const handleChangePage = (event, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeQuantity = (event: SelectChangeEvent<string>) => {
        const i = parseInt(event.target.name)

        // update db
        instance.post('/api/update_cart_quantity', {product_id : rows[i].id, quantity: event.target.value})        

        // update on frontend
        const rowsCopy: ItemInfo[] = [...rows]
        rowsCopy[i].quantity = parseInt(event.target.value)
        rowsCopy[i].totalPrice = rowsCopy[i].quantity * rowsCopy[i].price
        setRows(rowsCopy)
    }

    const handleRemoveItem = (event) => {
        const i = event.currentTarget.value

        // remove from db
        instance.post('/api/remove_from_cart', { product_id : rows[i].id })

        // remove from table
        const rowsCopy = [...rows]
        rowsCopy.splice(i, 1)
        setRows(rowsCopy)
    }

    const handleCheckout = (event) => {
        instance.post('/api/checkout_cart').then(res => {
            updateCart();
            <Alert severity="success">Ordered</Alert>;
            setOpen(true);
        }).catch((error) => alert(error.response.data.errMessage));
    }

    return(
        <div>   
            <Collapse in={open}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ 
                      mt: 8
                    }}
                  >
                    Order confirmed!
                  </Alert>
                </Collapse>
            <NavbarComponent/>
            <div style={{width: '70%', margin: 'auto'}}>
                <br />
                <br />
                <br />
                <h1>Cart</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((row: ItemInfo, i) => (
                                <TableRow>
                                    <TableCell>
                                        <Link style={{textDecoration: 'none', color: 'black'}} to={`/EachPage/${row.id}`}>
                                            {row.item}
                                        </Link>
                                    </TableCell>
                                    <TableCell>${row.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <FormControl variant='standard'>
                                            <Select
                                                value={row.quantity.toString()}
                                                label="Quantity"
                                                onChange={handleChangeQuantity}
                                                name={i.toString()}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={2}>2</MenuItem>
                                                <MenuItem value={3}>3</MenuItem>
                                                <MenuItem value={4}>4</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={6}>6</MenuItem>
                                                <MenuItem value={7}>7</MenuItem>
                                                <MenuItem value={8}>8</MenuItem>
                                                <MenuItem value={9}>9</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>${row.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell align='right' style={{width: '15%'}}>
                                        <Button
                                            variant='outlined'
                                            onClick={handleRemoveItem}
                                            value={i.toString()}
                                        >
                                            remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell><b>Total</b></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>${rows.map(r => r.totalPrice).reduce((a, b) => {return a + b}, 0).toFixed(2)}</TableCell>
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

                <br />
                <div style={{float: 'right'}}>
                    <Button variant='contained' onClick={handleCheckout}>
                        Checkout
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default protectedRoute(CartPage);